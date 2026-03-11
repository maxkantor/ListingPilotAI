# ListingPilot Backend API

## Structure

```
src/
├── ListingPilot.Api/                 # ASP.NET Core Web API (Lambda-ready)
│   ├── Controllers/
│   │   └── GenerationController.cs   # API endpoints
│   ├── Program.cs                    # App configuration
│   └── appsettings.json
├── ListingPilot.Application/         # Business logic
│   ├── Services/
│   │   ├── AiService.cs              # AI generation abstraction
│   │   └── GenerationService.cs      # Core generation logic
│   └── DTOs/
│       └── Dtos.cs                   # Data transfer objects
├── ListingPilot.Domain/              # Entities
│   └── Entities/
│       └── Models.cs
└── ListingPilot.Infrastructure/      # Data access
    ├── Repositories/
    │   └── GenerationRepository.cs   # In-memory repository (can swap to DynamoDB/SQL)
    └── AI/
```

## Setup

### Prerequisites
- .NET 8.0 SDK or later
- Visual Studio 2022 or VS Code with C# extension

### Local Development

```bash
cd backend

# Restore packages
dotnet restore

# Run API (defaults to http://localhost:5000)
dotnet run --project src/ListingPilot.Api

# Build for production
dotnet build -c Release

# Run tests (if added)
dotnet test
```

### Environment Configuration

Create or update `appsettings.Development.json`:

```json
{
  "OpenAI": {
    "ApiKey": "sk-..."  // Your OpenAI API key (or leave empty for mock mode)
  }
}
```

**Note:** If `OpenAI:ApiKey` is not provided, the app runs in mock mode with high-quality mock outputs.

## API Endpoints

### POST /api/generate
Generate marketing copy for a property.

**Request:**
```json
{
  "property": {
    "streetAddress": "123 Main St",
    "city": "Atlanta",
    "state": "GA",
    "price": "500000",
    "beds": "4",
    "baths": "2.5",
    "squareFeet": "2500",
    "keyFeatures": "Updated kitchen, hardwood floors",
    "tone": "Professional"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "output": {
    "mlsDescription": "...",
    "luxuryDescription": "...",
    "facebookPost": "...",
    "instagramCaption": "...",
    "linkedInPost": "...",
    "emailBlurb": "..."
  },
  "createdAt": "2026-03-10T12:00:00Z"
}
```

### GET /api/sample-property
Returns a sample property for testing.

### GET /api/history
Returns recent generation history.

### GET /api/health
Health check endpoint.

## AWS Lambda Deployment

This API is structured to be deployed as an AWS Lambda function using API Gateway.

### Build for Lambda

```bash
dotnet publish -c Release -o publish

# Create deployment package
cd publish
zip -r function.zip .
```

### Lambda Configuration

- **Runtime:** .NET 8 (or custom runtime)
- **Handler:** `ListingPilot.Api::ListingPilot.Api.LambdaEntryPoint::FunctionHandler`
- **Timeout:** 60 seconds
- **Memory:** 512 MB (min)
- **Environment Variables:**
  - `OPENAI_API_KEY`: Your OpenAI API key
  - `ASPNETCORE_ENVIRONMENT`: Production

### API Gateway Setup

1. Create REST API in API Gateway
2. Create resource `/api`
3. Create methods for each endpoint
4. Set integration to Lambda function
5. Enable CORS with frontend domain

### Infrastructure as Code (Terraform example)

```hcl
resource "aws_lambda_function" "listing_pilot_api" {
  filename      = "function.zip"
  function_name = "listing-pilot-api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "ListingPilot.Api::ListingPilot.Api.LambdaEntryPoint::FunctionHandler"
  runtime       = "provided.al2"  # Custom runtime for .NET 8

  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
    }
  }
}

resource "aws_apigatewayv2_api" "listing_pilot" {
  name          = "listing-pilot-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://yourdomain.com"]
  }
}
```

## Future Integrations

### DynamoDB (History Storage)
Replace `InMemoryGenerationRepository` with `DynamoDBGenerationRepository`:

```csharp
public class DynamoDBGenerationRepository : IGenerationRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private const string TableName = "ListingPilot-History";

    public async Task<GenerationRecord> SaveAsync(GenerationRecord record)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            { "id", new AttributeValue { S = record.Id } },
            { "property", new AttributeValue { S = JsonConvert.SerializeObject(record.Property) } },
            { "output", new AttributeValue { S = JsonConvert.SerializeObject(record.Output) } },
            { "createdAt", new AttributeValue { S = record.CreatedAt.ToString("O") } },
        };

        await _dynamoDb.PutItemAsync(TableName, item);
        return record;
    }

    // Implement other methods...
}
```

### AWS Bedrock (Alternative AI)
Add to `IAiService`:

```csharp
private async Task<GeneratedOutputDto> GenerateWithBedrockAsync(PropertyInputDto property)
{
    var client = new AmazonBedrockRuntimeClient();
    var request = new InvokeModelRequest
    {
        ModelId = "anthropic.claude-v2",
        Body = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(prompt))
    };

    var response = await client.InvokeModelAsync(request);
    // Parse and return response
}
```

### SQL Server (Production Data)
Replace DynamoDB with Entity Framework Core:

```csharp
public class ListingPilotContext : DbContext
{
    public DbSet<GenerationRecord> Generations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
    }
}
```

### Cognito (Authentication)
Add to `Program.cs`:

```csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = "https://cognito-idp.{region}.amazonaws.com/{pool-id}";
        options.Audience = "{client-id}";
    });
```

Then add `[Authorize]` to controllers.

### S3 Exports
Add export service:

```csharp
public interface IExportService
{
    Task<string> ExportToPdfAsync(GenerateResponseDto output, PropertyInputDto property);
}
```

Upload to S3:

```csharp
var s3Client = new AmazonS3Client();
await s3Client.PutObjectAsync(new PutObjectRequest
{
    BucketName = "listing-pilot-exports",
    Key = $"exports/{id}.pdf",
    FilePath = pdfPath
});
```

## CloudWatch Logging

Logs are automatically sent to CloudWatch when deployed to Lambda. View logs:

```bash
aws logs tail /aws/lambda/listing-pilot-api --follow
```

## CI/CD Pipeline (GitHub Actions example)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: "8.0"
      - run: dotnet publish -c Release -o publish
      - run: cd publish && zip -r function.zip .
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws lambda update-function-code --function-name listing-pilot-api --zip-file fileb://publish/function.zip
```

## Production Checklist

- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Configure OpenAI API key in Secrets Manager
- [ ] Enable API Gateway logging
- [ ] Set up CloudWatch alarms
- [ ] Configure DynamoDB table with TTL for history
- [ ] Add request throttling/rate limiting
- [ ] Enable X-Ray tracing
- [ ] Set up error tracking (DataDog, Sentry, etc.)
- [ ] Configure backups for persistent data
- [ ] Add WAF rules to API Gateway
- [ ] Document API for external consumers
