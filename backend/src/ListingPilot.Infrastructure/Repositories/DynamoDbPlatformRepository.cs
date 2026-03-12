using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

public class DynamoDbPlatformRepository : IPlatformRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private readonly string _tableName;
    private readonly SemaphoreSlim _seedLock = new(1, 1);
    private volatile bool _seedChecked;

    public DynamoDbPlatformRepository(IAmazonDynamoDB dynamoDb, IConfiguration configuration)
    {
        _dynamoDb = dynamoDb;
        _tableName = configuration["DynamoDb:TableName"]
            ?? configuration["GENERATION_TABLE_NAME"]
            ?? throw new InvalidOperationException("A DynamoDB table name must be provided via DynamoDb:TableName or GENERATION_TABLE_NAME.");
    }

    public async Task<List<ListingProject>> GetListingsAsync()
    {
        await EnsureSeedDataAsync();
        return (await ScanByEntityTypeAsync<ListingProject>(nameof(ListingProject)))
            .OrderByDescending(x => x.UpdatedAt)
            .ToList();
    }

    public async Task<List<GeneratedAsset>> GetAssetsByListingIdAsync(string listingId)
    {
        await EnsureSeedDataAsync();

        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = $"LISTING#{listingId}" },
            },
            ScanIndexForward = false,
        });

        return response.Items
            .Select(DynamoDbRepositorySupport.Deserialize<GeneratedAsset>)
            .OrderByDescending(x => x.UpdatedAt)
            .ToList();
    }

    public async Task<WorkspaceSettings> GetSettingsAsync()
    {
        await EnsureSeedDataAsync();

        var response = await _dynamoDb.GetItemAsync(new GetItemRequest
        {
            TableName = _tableName,
            Key = new Dictionary<string, AttributeValue>
            {
                ["PK"] = new() { S = "TEAM#team-atlanta" },
                ["SK"] = new() { S = "SETTINGS#workspace" },
            },
        });

        return response.Item.Count == 0
            ? PlatformSeedData.Settings
            : DynamoDbRepositorySupport.Deserialize<WorkspaceSettings>(response.Item);
    }

    public async Task<WorkspaceSettings> SaveSettingsAsync(WorkspaceSettings settings)
    {
        await EnsureSeedDataAsync();

        await PutEntityAsync(settings, settings.Pk, settings.Sk, nameof(WorkspaceSettings), settings.Id);
        return settings;
    }

    public async Task<List<UserAccount>> GetUsersAsync()
    {
        await EnsureSeedDataAsync();
        return (await ScanByEntityTypeAsync<UserAccount>(nameof(UserAccount)))
            .OrderByDescending(x => x.LastActiveAt)
            .ToList();
    }

    public async Task<List<Lead>> GetLeadsAsync()
    {
        await EnsureSeedDataAsync();

        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = "PIPELINE#default" },
            },
            ScanIndexForward = false,
        });

        return response.Items
            .Select(DynamoDbRepositorySupport.Deserialize<Lead>)
            .ToList();
    }

    public async Task<List<SubscriptionPlan>> GetPlansAsync()
    {
        await EnsureSeedDataAsync();

        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = "PLAN" },
            },
        });

        return response.Items
            .Select(DynamoDbRepositorySupport.Deserialize<SubscriptionPlan>)
            .OrderBy(x => x.MonthlyPrice)
            .ToList();
    }

    public async Task<List<AuditEvent>> GetAuditEventsAsync()
    {
        await EnsureSeedDataAsync();

        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = "AUDIT" },
            },
            ScanIndexForward = false,
        });

        return response.Items
            .Select(DynamoDbRepositorySupport.Deserialize<AuditEvent>)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<List<ContactSubmission>> GetContactSubmissionsAsync()
    {
        await EnsureSeedDataAsync();
        return await QueryByPartitionAsync<ContactSubmission>("CONTACT");
    }

    public async Task<List<DemoRequest>> GetDemoRequestsAsync()
    {
        await EnsureSeedDataAsync();
        return await QueryByPartitionAsync<DemoRequest>("DEMO");
    }

    public async Task<ContactSubmission> SaveContactSubmissionAsync(ContactSubmission submission)
    {
        await EnsureSeedDataAsync();
        await PutEntityAsync(submission, submission.Pk, submission.Sk, nameof(ContactSubmission), submission.Id, submission.Gsi1Pk, submission.Gsi1Sk, createdAt: submission.CreatedAt);
        return submission;
    }

    public async Task<DemoRequest> SaveDemoRequestAsync(DemoRequest request)
    {
        await EnsureSeedDataAsync();
        await PutEntityAsync(request, request.Pk, request.Sk, nameof(DemoRequest), request.Id, request.Gsi1Pk, request.Gsi1Sk, createdAt: request.CreatedAt);
        return request;
    }

    private async Task<List<T>> QueryByPartitionAsync<T>(string partitionKey)
    {
        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = partitionKey },
            },
            ScanIndexForward = false,
        });

        return response.Items.Select(DynamoDbRepositorySupport.Deserialize<T>).ToList();
    }

    private async Task<List<T>> ScanByEntityTypeAsync<T>(string entityType)
    {
        var items = new List<Dictionary<string, AttributeValue>>();
        Dictionary<string, AttributeValue>? lastEvaluatedKey = null;

        do
        {
            var response = await _dynamoDb.ScanAsync(new ScanRequest
            {
                TableName = _tableName,
                FilterExpression = "EntityType = :entityType",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    [":entityType"] = new() { S = entityType },
                },
                ExclusiveStartKey = lastEvaluatedKey,
            });

            items.AddRange(response.Items);
            lastEvaluatedKey = response.LastEvaluatedKey;
        }
        while (lastEvaluatedKey is { Count: > 0 });

        return items.Select(DynamoDbRepositorySupport.Deserialize<T>).ToList();
    }

    private async Task PutEntityAsync<T>(
        T entity,
        string pk,
        string sk,
        string entityType,
        string id,
        string? gsi1Pk = null,
        string? gsi1Sk = null,
        DateTime? createdAt = null,
        DateTime? updatedAt = null)
    {
        var item = DynamoDbRepositorySupport.CreateItem(pk, sk, entityType, id, entity, gsi1Pk, gsi1Sk, createdAt, updatedAt);
        await _dynamoDb.PutItemAsync(new PutItemRequest
        {
            TableName = _tableName,
            Item = item,
        });
    }

    private async Task EnsureSeedDataAsync()
    {
        if (_seedChecked)
        {
            return;
        }

        await _seedLock.WaitAsync();
        try
        {
            if (_seedChecked)
            {
                return;
            }

            var response = await _dynamoDb.GetItemAsync(new GetItemRequest
            {
                TableName = _tableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    ["PK"] = new() { S = PlatformSeedData.Settings.Pk },
                    ["SK"] = new() { S = PlatformSeedData.Settings.Sk },
                },
            });

            if (response.Item.Count == 0)
            {
                var seedWrites = new List<WriteRequest>();
                seedWrites.AddRange(PlatformSeedData.Listings.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(ListingProject), entity.Id, entity.Gsi1Pk, entity.Gsi1Sk, updatedAt: entity.UpdatedAt)));
                seedWrites.AddRange(PlatformSeedData.Assets.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(GeneratedAsset), entity.Id, entity.Gsi1Pk, entity.Gsi1Sk, updatedAt: entity.UpdatedAt)));
                seedWrites.Add(ToWriteRequest(PlatformSeedData.Settings, PlatformSeedData.Settings.Pk, PlatformSeedData.Settings.Sk, nameof(WorkspaceSettings), PlatformSeedData.Settings.Id));
                seedWrites.AddRange(PlatformSeedData.Users.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(UserAccount), entity.Id, entity.Gsi1Pk, entity.Gsi1Sk, updatedAt: entity.LastActiveAt)));
                seedWrites.AddRange(PlatformSeedData.Leads.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(Lead), entity.Id, entity.Gsi1Pk, entity.Gsi1Sk)));
                seedWrites.AddRange(PlatformSeedData.Plans.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(SubscriptionPlan), entity.Id)));
                seedWrites.AddRange(PlatformSeedData.AuditEvents.Select(entity => ToWriteRequest(entity, entity.Pk, entity.Sk, nameof(AuditEvent), entity.Id, createdAt: entity.CreatedAt)));

                foreach (var batch in seedWrites.Chunk(25))
                {
                    await _dynamoDb.BatchWriteItemAsync(new BatchWriteItemRequest
                    {
                        RequestItems = new Dictionary<string, List<WriteRequest>>
                        {
                            [_tableName] = batch.ToList(),
                        },
                    });
                }
            }

            _seedChecked = true;
        }
        finally
        {
            _seedLock.Release();
        }
    }

    private static WriteRequest ToWriteRequest<T>(
        T entity,
        string pk,
        string sk,
        string entityType,
        string id,
        string? gsi1Pk = null,
        string? gsi1Sk = null,
        DateTime? createdAt = null,
        DateTime? updatedAt = null)
    {
        return new WriteRequest
        {
            PutRequest = new PutRequest
            {
                Item = DynamoDbRepositorySupport.CreateItem(pk, sk, entityType, id, entity, gsi1Pk, gsi1Sk, createdAt, updatedAt),
            },
        };
    }
}
