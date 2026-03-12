using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

public class DynamoDbGenerationRepository : IGenerationRepository
{
    private const string GenerationPartitionKey = "GENERATION";

    private readonly IAmazonDynamoDB _dynamoDb;
    private readonly string _tableName;

    public DynamoDbGenerationRepository(IAmazonDynamoDB dynamoDb, IConfiguration configuration)
    {
        _dynamoDb = dynamoDb;
        _tableName = configuration["DynamoDb:TableName"]
            ?? configuration["GENERATION_TABLE_NAME"]
            ?? throw new InvalidOperationException("A DynamoDB table name must be provided via DynamoDb:TableName or GENERATION_TABLE_NAME.");
    }

    public async Task<GenerationRecord> SaveAsync(GenerationRecord record)
    {
        record.Id = string.IsNullOrWhiteSpace(record.Id) ? Guid.NewGuid().ToString() : record.Id;
        record.CreatedAt = record.CreatedAt == default ? DateTime.UtcNow : record.CreatedAt;

        var item = DynamoDbRepositorySupport.CreateItem(
            GenerationPartitionKey,
            $"RECORD#{record.CreatedAt:O}#{record.Id}",
            nameof(GenerationRecord),
            record.Id,
            record,
            createdAt: record.CreatedAt);

        await _dynamoDb.PutItemAsync(new PutItemRequest
        {
            TableName = _tableName,
            Item = item,
        });

        return record;
    }

    public async Task<List<GenerationRecord>> GetAllAsync()
    {
        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new() { S = GenerationPartitionKey },
            },
            ScanIndexForward = false,
        });

        return response.Items.Select(DynamoDbRepositorySupport.Deserialize<GenerationRecord>).ToList();
    }

    public async Task<GenerationRecord?> GetByIdAsync(string id)
    {
        var response = await _dynamoDb.ScanAsync(new ScanRequest
        {
            TableName = _tableName,
            FilterExpression = "EntityType = :entityType AND Id = :id",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":entityType"] = new() { S = nameof(GenerationRecord) },
                [":id"] = new() { S = id },
            },
            Limit = 1,
        });

        var item = response.Items.FirstOrDefault();
        return item is null ? null : DynamoDbRepositorySupport.Deserialize<GenerationRecord>(item);
    }
}
