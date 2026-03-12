using Amazon.DynamoDBv2.Model;
using System.Text.Json;

namespace ListingPilot.Infrastructure.Repositories;

internal static class DynamoDbRepositorySupport
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true,
    };

    public static Dictionary<string, AttributeValue> CreateItem<T>(
        string pk,
        string sk,
        string entityType,
        string id,
        T data,
        string? gsi1Pk = null,
        string? gsi1Sk = null,
        DateTime? createdAt = null,
        DateTime? updatedAt = null)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            ["PK"] = new() { S = pk },
            ["SK"] = new() { S = sk },
            ["EntityType"] = new() { S = entityType },
            ["Id"] = new() { S = id },
            ["Data"] = new() { S = JsonSerializer.Serialize(data, JsonOptions) },
        };

        if (!string.IsNullOrWhiteSpace(gsi1Pk))
        {
            item["GSI1PK"] = new AttributeValue { S = gsi1Pk };
        }

        if (!string.IsNullOrWhiteSpace(gsi1Sk))
        {
            item["GSI1SK"] = new AttributeValue { S = gsi1Sk };
        }

        if (createdAt.HasValue)
        {
            item["CreatedAt"] = new AttributeValue { S = createdAt.Value.ToString("O") };
        }

        if (updatedAt.HasValue)
        {
            item["UpdatedAt"] = new AttributeValue { S = updatedAt.Value.ToString("O") };
        }

        return item;
    }

    public static T Deserialize<T>(Dictionary<string, AttributeValue> item)
    {
        if (!item.TryGetValue("Data", out var dataAttribute) || string.IsNullOrWhiteSpace(dataAttribute.S))
        {
            throw new InvalidOperationException("DynamoDB item is missing the Data payload.");
        }

        var model = JsonSerializer.Deserialize<T>(dataAttribute.S, JsonOptions);
        return model ?? throw new InvalidOperationException($"Unable to deserialize DynamoDB payload into {typeof(T).Name}.");
    }

    public static string? GetString(Dictionary<string, AttributeValue> item, string key)
        => item.TryGetValue(key, out var value) ? value.S : null;
}
