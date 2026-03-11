# AWS Lambda Deployment Guide

This guide covers deploying ListingPilot to AWS Lambda + API Gateway + S3 + CloudFront.

## Architecture Diagram

```
Frontend (React)                Backend (ASP.NET Core)
      ↓                               ↓
   S3 bucket                      Lambda function
      ↓                               ↓
 CloudFront ←――――――――――――→ API Gateway
 (CDN)                         (REST endpoint)
                                     ↓
                           (optional) DynamoDB
                           (optional) Bedrock AI
```

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- .NET 8 SDK installed
- Node.js 18+ installed

## Step 1: Prepare Backend for Lambda

### Create Lambda Handler

Create `src/ListingPilot.Api/LambdaEntryPoint.cs`:

```csharp
using Amazon.Lambda.AspNetCoreServer;

namespace ListingPilot.Api;

public class LambdaEntryPoint : APIGatewayProxyFunction
{
    protected override void Init(IWebHostBuilder builder)
    {
        builder.UseStartup<Startup>();
    }
}

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Same as Program.cs
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Same as Program.cs
    }
}
```

### Update Project File

Add to `ListingPilot.Api.csproj`:

```xml
<ItemGroup>
  <PackageReference Include="Amazon.Lambda.AspNetCoreServer.Hosting" Version="1.7.0" />
</ItemGroup>
```

### Create Deployment Package

```bash
cd backend

# Restore and publish
dotnet restore
dotnet publish -c Release -o publish

# Create zip
cd publish
Compress-Archive -Path * -DestinationPath function.zip -Force

# Move to repo root
Move-Item function.zip ..\..\
```

## Step 2: Create Lambda Function

### Using AWS Console

1. Go to **Lambda** → **Create Function**
2. Function name: `listing-pilot-api`
3. Runtime: **Custom runtime** (or **.NET 8** if available)
4. Architecture: **x86_64**
5. Create function

### Upload Code

1. Click **Upload from** → **ZIP file**
2. Select `function.zip`
3. Click **Deploy**

### Configure Handler

In function settings:

- **Handler:** `ListingPilot.Api::ListingPilot.Api.LambdaEntryPoint::FunctionHandler`

### Set Environment Variables

1. Go to **Configuration** → **Environment variables**
2. Add:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `OPENAI_API_KEY`: (your key or leave empty for mock)

### Increase Resources (if needed)

- **Memory:** 512 MB (min for API)
- **Timeout:** 60 seconds
- **Ephemeral storage:** 512 MB

## Step 3: Set Up API Gateway

### Create REST API

1. Go to **API Gateway** → **Create API**
2. Choose **REST API**
3. Name: `listing-pilot-api`
4. Click **Create API**

### Create Resource Structure

1. Root resource `/`
   - Create resource `api`
   - Under `api`:
     - Create resource `generate`
     - Create resource `sample-property`
     - Create resource `history`
     - Create resource `health`

### Create Methods

For each resource, create:
- `POST /api/generate` → Lambda
- `GET /api/sample-property` → Lambda
- `GET /api/history` → Lambda
- `POST /api/history` → Lambda
- `GET /api/health` → Lambda

**For each method:**

1. Select method
2. **Integration type:** AWS Lambda
3. **Lambda function:** `listing-pilot-api`
4. **Deploy**

### Enable CORS

1. Select root resource `/`
2. **Actions** → **Enable CORS**
3. **Access-Control-Allow-Headers:** Add `Content-Type`
4. **Deploy API**

### Get Invoke URL

After deployment:
- **Stages** → **prod**
- Copy **Invoke URL** (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

## Step 4: Deploy Frontend to S3 + CloudFront

### Create S3 Bucket

```bash
aws s3 mb s3://listing-pilot-frontend --region us-east-1
```

### Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::listing-pilot-frontend/*"
    }
  ]
}
```

### Build Frontend

```bash
cd frontend

# Update .env.production with API Gateway URL
echo "VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod" > .env.production

npm run build
```

### Upload to S3

```bash
aws s3 sync dist/ s3://listing-pilot-frontend/ --delete
```

### Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name listing-pilot-frontend.s3.us-east-1.amazonaws.com \
  --default-root-object index.html
```

Or use AWS Console:

1. Go to **CloudFront** → **Create distribution**
2. **Origin domain:** S3 bucket
3. **Origin access:** Origin Access Control (OAC)
4. **Default cache behavior:**
   - **Compress objects automatically:** Yes
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
5. **Error responses:**
   - Error code 404 → Response page `/index.html` → Status 200
   - Error code 403 → Response page `/index.html` → Status 200
6. **Create distribution**

### Invalidate Cache

```bash
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

## Step 5: Connect Domain (Optional)

### Route53 (if using AWS DNS)

1. **Create hosted zone** for your domain
2. **Create record:**
   - Type: **A**
   - Alias to CloudFront distribution
   - Save

### External DNS Provider

Add CNAME record:
```
listingpilot.com CNAME d123.cloudfront.net
```

### SSL Certificate (CloudFront)

1. Request certificate in **AWS Certificate Manager**
2. Add domain names: `listingpilot.com`, `www.listingpilot.com`
3. Validate DNS
4. Attach to CloudFront distribution

## Step 6: Monitoring & Logging

### CloudWatch Logs

View Lambda logs:

```bash
aws logs tail /aws/lambda/listing-pilot-api --follow
```

### Enable X-Ray Tracing

1. Lambda → **Configuration** → **Monitoring and operations tools**
2. **X-Ray write access:** Enable
3. In code, add tracing middleware (optional)

### Set Up Alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name listing-pilot-errors \
  --alarm-description "Alert on Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=listing-pilot-api
```

## Step 7: CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ListingPilot

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  LAMBDA_FUNCTION: listing-pilot-api
  S3_BUCKET: listing-pilot-frontend
  CF_DIST_ID: E1234567890

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: "8.0"
      
      - name: Build Backend
        run: |
          cd backend
          dotnet publish -c Release -o publish
          cd publish
          zip -r ../function.zip .
      
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy Lambda
        run: |
          aws lambda update-function-code \
            --function-name ${{ env.LAMBDA_FUNCTION }} \
            --zip-file fileb://backend/function.zip

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Upload to S3
        run: |
          aws s3 sync frontend/dist/ s3://${{ env.S3_BUCKET }}/ --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CF_DIST_ID }} \
            --paths "/*"
```

## Troubleshooting

### Lambda timeout errors
- Increase timeout in Lambda settings
- Check backend logs in CloudWatch

### API Gateway CORS errors
- Enable CORS on all resources
- Check API Gateway logs

### Frontend 403 errors
- Verify S3 bucket policy allows CloudFront access
- Check CloudFront origin access settings

### Slow API response
- Check Lambda memory allocation
- Enable Lambda provisioned concurrency
- Consider caching with CloudFront

## Cost Estimation

- **Lambda:** ~$0.20 per 1M requests (free tier: 1M/month)
- **API Gateway:** ~$3.50 per 1M requests
- **S3:** ~$0.023 per GB stored
- **CloudFront:** ~$0.085 per GB transferred
- **DynamoDB:** ~$1.25 per million write units (if added)

For a small MVP, expect **$5-20/month**.

## Security Best Practices

- [ ] Enable Lambda function versioning
- [ ] Use IAM roles with least privilege
- [ ] Enable CloudTrail for audit logging
- [ ] Rotate API keys regularly
- [ ] Enable API key requirements in API Gateway
- [ ] Use WAF for DDoS protection
- [ ] Enable S3 versioning for rollback capability
- [ ] Encrypt Lambda environment variables
- [ ] Enable VPC endpoint for private API calls (if needed)

## Next Steps

1. Test API endpoints with curl or Postman
2. Monitor CloudWatch logs
3. Set up auto-scaling if needed
4. Add authentication (Cognito)
5. Enable billing alarms
