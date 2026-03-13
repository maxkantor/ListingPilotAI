using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

public class DynamoDbCommerceRepository : ICommerceRepository
{
	private readonly IAmazonDynamoDB _dynamoDb;
	private readonly string _tableName;
	private readonly SemaphoreSlim _seedLock = new(1, 1);
	private volatile bool _seeded;

	public DynamoDbCommerceRepository(IAmazonDynamoDB dynamoDb, IConfiguration configuration)
	{
		_dynamoDb = dynamoDb;
		_tableName = configuration["DynamoDb:TableName"]
			?? configuration["GENERATION_TABLE_NAME"]
			?? throw new InvalidOperationException("A DynamoDB table name must be configured for commerce persistence.");
	}

	public async Task<UsagePolicyConfig> GetUsagePolicyAsync()
	{
		await EnsureSeedDataAsync();
		var item = await GetItemAsync("CONFIG", "USAGE_POLICY");
		return item.Count == 0 ? new InMemoryCommerceRepository().GetUsagePolicyAsync().Result : DynamoDbRepositorySupport.Deserialize<UsagePolicyConfig>(item);
	}

	public async Task<List<MonetizationPackage>> GetPackagesAsync()
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<MonetizationPackage>("CONFIG"))
			.Where(x => x.EntityType == nameof(MonetizationPackage))
			.OrderBy(x => x.PriceUsd)
			.ToList();
	}

	public async Task<UserProfile?> GetUserByIdAsync(string userId)
	{
		await EnsureSeedDataAsync();
		var item = await GetItemAsync($"USER#{userId}", "PROFILE");
		return item.Count == 0 ? null : DynamoDbRepositorySupport.Deserialize<UserProfile>(item);
	}

	public async Task<UserProfile?> GetUserByEmailAsync(string email)
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<UserProfile>(nameof(UserProfile)))
			.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
	}

	public async Task<List<UserProfile>> ListUsersAsync()
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<UserProfile>(nameof(UserProfile)))
			.OrderByDescending(x => x.CreatedAt)
			.ToList();
	}

	public async Task<UserProfile> UpsertUserAsync(UserProfile user)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(user, user.Pk, user.Sk, nameof(UserProfile), user.Id, user.Gsi1Pk, user.Gsi1Sk, user.CreatedAt, user.UpdatedAt);
		return user;
	}

	public async Task<UsageLedger?> GetUsageLedgerAsync(string subjectType, string subjectId, string scope)
	{
		await EnsureSeedDataAsync();
		var item = await GetItemAsync($"USAGE#{subjectType}#{subjectId}", $"SCOPE#{scope}");
		return item.Count == 0 ? null : DynamoDbRepositorySupport.Deserialize<UsageLedger>(item);
	}

	public async Task<UsageLedger> UpsertUsageLedgerAsync(UsageLedger ledger)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(ledger, ledger.Pk, ledger.Sk, nameof(UsageLedger), ledger.Id, ledger.Gsi1Pk, ledger.Gsi1Sk, updatedAt: ledger.UpdatedAt);
		return ledger;
	}

	public async Task<ActivityEventRecord> SaveEventAsync(ActivityEventRecord activityEvent)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(activityEvent, activityEvent.Pk, activityEvent.Sk, nameof(ActivityEventRecord), activityEvent.Id, activityEvent.Gsi1Pk, activityEvent.Gsi1Sk, createdAt: activityEvent.OccurredAt);
		return activityEvent;
	}

	public async Task<List<ActivityEventRecord>> ListEventsAsync(int take = 200)
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<ActivityEventRecord>(nameof(ActivityEventRecord)))
			.OrderByDescending(x => x.OccurredAt)
			.Take(take)
			.ToList();
	}

	public async Task<List<ActivityEventRecord>> GetUserEventsAsync(string userId, int take = 200)
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<ActivityEventRecord>($"USER#{userId}"))
			.Where(x => x.EntityType == nameof(ActivityEventRecord))
			.OrderByDescending(x => x.OccurredAt)
			.Take(take)
			.ToList();
	}

	public async Task<PurchaseRecord?> GetPurchaseByCheckoutSessionIdAsync(string checkoutSessionId)
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<PurchaseRecord>(nameof(PurchaseRecord)))
			.FirstOrDefault(x => x.StripeCheckoutSessionId == checkoutSessionId);
	}

	public async Task<PurchaseRecord> SavePurchaseAsync(PurchaseRecord purchase)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(purchase, purchase.Pk, purchase.Sk, nameof(PurchaseRecord), purchase.Id, purchase.Gsi1Pk, purchase.Gsi1Sk, purchase.CreatedAt, purchase.CompletedAt);
		return purchase;
	}

	public async Task<List<PurchaseRecord>> GetPurchasesByUserIdAsync(string userId)
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<PurchaseRecord>($"USER#{userId}"))
			.Where(x => x.EntityType == nameof(PurchaseRecord))
			.OrderByDescending(x => x.CreatedAt)
			.ToList();
	}

	public async Task<List<PurchaseRecord>> ListPurchasesAsync()
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<PurchaseRecord>(nameof(PurchaseRecord)))
			.OrderByDescending(x => x.CreatedAt)
			.ToList();
	}

	public async Task<ContactInquiry> SaveContactInquiryAsync(ContactInquiry inquiry)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(inquiry, inquiry.Pk, inquiry.Sk, nameof(ContactInquiry), inquiry.Id, inquiry.Gsi1Pk, inquiry.Gsi1Sk, inquiry.CreatedAt, inquiry.UpdatedAt);
		return inquiry;
	}

	public async Task<ContactInquiry?> GetContactInquiryAsync(string inquiryId)
	{
		await EnsureSeedDataAsync();
		var result = (await ScanByEntityTypeAsync<ContactInquiry>(nameof(ContactInquiry))).FirstOrDefault(x => x.Id == inquiryId);
		return result;
	}

	public async Task<List<ContactInquiry>> ListContactInquiriesAsync()
	{
		await EnsureSeedDataAsync();
		return (await ScanByEntityTypeAsync<ContactInquiry>(nameof(ContactInquiry)))
			.OrderByDescending(x => x.UpdatedAt)
			.ToList();
	}

	public async Task<ContactReplyRecord> SaveContactReplyAsync(ContactReplyRecord reply)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(reply, reply.Pk, reply.Sk, nameof(ContactReplyRecord), reply.Id, createdAt: reply.SentAt);
		return reply;
	}

	public async Task<List<ContactReplyRecord>> GetContactRepliesAsync(string inquiryId)
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<ContactReplyRecord>($"CONTACT#{inquiryId}"))
			.Where(x => x.EntityType == nameof(ContactReplyRecord))
			.OrderByDescending(x => x.SentAt)
			.ToList();
	}

	public async Task<UserNoteRecord> SaveUserNoteAsync(UserNoteRecord note)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(note, note.Pk, note.Sk, nameof(UserNoteRecord), note.Id, createdAt: note.CreatedAt);
		return note;
	}

	public async Task<List<UserNoteRecord>> GetUserNotesAsync(string userId)
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<UserNoteRecord>($"USER#{userId}"))
			.Where(x => x.EntityType == nameof(UserNoteRecord))
			.OrderByDescending(x => x.CreatedAt)
			.ToList();
	}

	public async Task<AdminActionRecord> SaveAdminActionAsync(AdminActionRecord action)
	{
		await EnsureSeedDataAsync();
		await PutEntityAsync(action, action.Pk, action.Sk, nameof(AdminActionRecord), action.Id, createdAt: action.CreatedAt);
		return action;
	}

	public async Task<List<AdminActionRecord>> ListAdminActionsAsync()
	{
		await EnsureSeedDataAsync();
		return await QueryPartitionAsync<AdminActionRecord>("ADMIN_ACTION");
	}

	public async Task<List<AdminActionRecord>> GetAdminActionsForUserAsync(string userId)
	{
		await EnsureSeedDataAsync();
		return (await QueryPartitionAsync<AdminActionRecord>("ADMIN_ACTION"))
			.Where(x => x.TargetUserId == userId)
			.OrderByDescending(x => x.CreatedAt)
			.ToList();
	}

	private async Task EnsureSeedDataAsync()
	{
		if (_seeded)
		{
			return;
		}

		await _seedLock.WaitAsync();
		try
		{
			if (_seeded)
			{
				return;
			}

			var existing = await GetItemAsync("CONFIG", "USAGE_POLICY");
			if (existing.Count == 0)
			{
				var seed = new InMemoryCommerceRepository();
				var writes = new List<WriteRequest>();

				var usagePolicy = await seed.GetUsagePolicyAsync();
				writes.Add(ToWrite(usagePolicy, usagePolicy.Pk, usagePolicy.Sk, nameof(UsagePolicyConfig), usagePolicy.Id));

				foreach (var package in await seed.GetPackagesAsync())
				{
					writes.Add(ToWrite(package, package.Pk, package.Sk, nameof(MonetizationPackage), package.Id));
				}

				foreach (var user in await seed.ListUsersAsync())
				{
					writes.Add(ToWrite(user, user.Pk, user.Sk, nameof(UserProfile), user.Id, user.Gsi1Pk, user.Gsi1Sk, user.CreatedAt, user.UpdatedAt));
				}

				foreach (var batch in writes.Chunk(25))
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

			_seeded = true;
		}
		finally
		{
			_seedLock.Release();
		}
	}

	private async Task<Dictionary<string, AttributeValue>> GetItemAsync(string pk, string sk)
	{
		var response = await _dynamoDb.GetItemAsync(new GetItemRequest
		{
			TableName = _tableName,
			Key = new Dictionary<string, AttributeValue>
			{
				["PK"] = new() { S = pk },
				["SK"] = new() { S = sk },
			},
		});

		return response.Item;
	}

	private async Task<List<T>> QueryPartitionAsync<T>(string pk)
	{
		var response = await _dynamoDb.QueryAsync(new QueryRequest
		{
			TableName = _tableName,
			KeyConditionExpression = "PK = :pk",
			ExpressionAttributeValues = new Dictionary<string, AttributeValue>
			{
				[":pk"] = new() { S = pk },
			},
			ScanIndexForward = false,
		});

		return response.Items.Select(DynamoDbRepositorySupport.Deserialize<T>).ToList();
	}

	private async Task<List<T>> ScanByEntityTypeAsync<T>(string entityType)
	{
		var items = new List<Dictionary<string, AttributeValue>>();
		Dictionary<string, AttributeValue>? lastKey = null;

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
				ExclusiveStartKey = lastKey,
			});
			items.AddRange(response.Items);
			lastKey = response.LastEvaluatedKey;
		}
		while (lastKey is { Count: > 0 });

		return items.Select(DynamoDbRepositorySupport.Deserialize<T>).ToList();
	}

	private async Task PutEntityAsync<T>(T entity, string pk, string sk, string entityType, string id, string? gsi1Pk = null, string? gsi1Sk = null, DateTime? createdAt = null, DateTime? updatedAt = null)
	{
		await _dynamoDb.PutItemAsync(new PutItemRequest
		{
			TableName = _tableName,
			Item = DynamoDbRepositorySupport.CreateItem(pk, sk, entityType, id, entity, gsi1Pk, gsi1Sk, createdAt, updatedAt),
		});
	}

	private static WriteRequest ToWrite<T>(T entity, string pk, string sk, string entityType, string id, string? gsi1Pk = null, string? gsi1Sk = null, DateTime? createdAt = null, DateTime? updatedAt = null)
		=> new()
		{
			PutRequest = new PutRequest
			{
				Item = DynamoDbRepositorySupport.CreateItem(pk, sk, entityType, id, entity, gsi1Pk, gsi1Sk, createdAt, updatedAt),
			},
		};
}
