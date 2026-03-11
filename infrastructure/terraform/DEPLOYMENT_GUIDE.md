# Terraform Deployment Guide

## Overview

ListingPilot AI uses Terraform to manage AWS infrastructure via Infrastructure as Code (IaC).

## Directory Structure

```
infrastructure/terraform/
├── providers.tf              # AWS provider config
├── variables.tf              # Input variables with defaults
├── main.tf                   # Core resource definitions
├── outputs.tf                # Output values
├── terraform.tfvars          # Environment-specific values
├── terraform.tfvars.example  # Template for terraform.tfvars
├── .gitignore                # Ignore tfstate, .terraform/, etc
└── artifacts/
    ├── publish/              # Lambda publish directory
    └── listingpilot-api.zip  # Packaged Lambda deployment
```

## Variables

All configurable via `terraform.tfvars`. Key variables:

| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `aws_region` | string | `us-east-1` | AWS region |
| `project_name` | string | `listingpilot` | Resource prefix |
| `environment` | string | `dev` | Environment name (dev/stage/prod) |
| `lambda_zip_path` | string | `./artifacts/listingpilot-api.zip` | Lambda package location |
| `create_frontend_bucket` | bool | `true` | Enable S3 + CloudFront |
| `enable_amplify` | bool | `false` | Enable Amplify app |
| `cors_allow_origins` | list(string) | `["http://localhost:3000"]` | CORS origins |
| `openai_api_key_parameter_name` | string | `/listingpilot/dev/openai/api-key` | SSM param for OpenAI key |
| `ssm_plain_parameters` | map | `{}` | Plain text SSM parameters |
| `ssm_secure_parameters` | map | `{}` | Encrypted SSM parameters |

## Outputs

After `terraform apply`, these outputs are available:

| Output | Purpose |
|--------|---------|
| `api_gateway_invoke_url` | Base URL for API |
| `lambda_function_name` | Name of Lambda function |
| `dynamodb_table_name` | DynamoDB table for generation records |
| `frontend_s3_bucket_name` | S3 bucket for static frontend |
| `cloudfront_distribution_id` | CloudFront distribution ID |
| `cloudfront_domain_name` | CloudFront domain (d1nlcchc6ijihw.cloudfront.net) |

Access via:
```bash
terraform output api_gateway_invoke_url
terraform output -json  # All outputs as JSON
```

## Deployment Steps

### 1. Prerequisites

- Terraform >= 1.6
- AWS CLI configured (`aws sts get-caller-identity` works)
- AWS credentials with permissions for Lambda, API Gateway, DynamoDB, S3, CloudFront, IAM, SSM, CloudWatch

### 2. Initialize

```bash
cd infrastructure/terraform
terraform init
```

This creates `.terraform/` directory and downloads AWS provider plugins.

### 3. Plan

```bash
terraform plan -out tfplan
```

Review changes before applying. Shows:
- Resources to create (+)
- Resources to modify (~)
- Resources to destroy (-)

### 4. Apply

```bash
terraform apply tfplan
```

Or without plan file:
```bash
terraform apply -auto-approve
```

**First deployment typically takes 5-10 minutes** (CloudFront distribution is slowest at ~6 min).

### 5. Verify

```bash
API=$(terraform output -raw api_gateway_invoke_url)
curl $API/api/health
# Should return: {"status":"healthy"}
```

## Managing State

Terraform maintains state in `terraform.tfstate` (local file for dev).

**Important**: 
- ✅ Add `.terraform/` and `*.tfstate*` to `.gitignore` (already configured)
- ❌ Never commit state files to git
- ⚠️ For production, use remote state (S3 + DynamoDB lock)

### Remote State Setup (Optional for Prod)

```hcl
# Add to providers.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "listingpilot/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

Then migrate:
```bash
terraform init  # Choose to migrate state
```

## Common Operations

### Update Lambda Code

1. Rebuild backend
2. Publish to artifacts
3. Run `terraform apply` (automatically detects zip hash change)

```bash
cd backend
dotnet publish -c Release -o ../infrastructure/terraform/artifacts/publish
Compress-Archive -Path ../infrastructure/terraform/artifacts/publish/* -DestinationPath ../infrastructure/terraform/artifacts/listingpilot-api.zip
cd ../infrastructure/terraform
terraform apply -auto-approve
```

### Update Frontend

1. Build frontend
2. Update S3
3. Invalidate CloudFront

```bash
cd frontend
npm run build
BUCKET=$(cd ../infrastructure/terraform && terraform output -raw frontend_s3_bucket_name)
DIST=$(cd ../infrastructure/terraform && terraform output -raw cloudfront_distribution_id)
aws s3 sync dist s3://$BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"
```

### Change Environment Variables

Edit `terraform.tfvars` and apply:

```hcl
ssm_plain_parameters = {
  "/listingpilot/dev/openai/model" = "gpt-4-turbo"
}
```

Then:
```bash
terraform apply -auto-approve
```

### Scale Lambda

Edit `terraform.tfvars`:
```hcl
lambda_memory_size = 2048  # Increase from 1024
lambda_timeout     = 60    # Increase from 30
```

Then apply.

### Add Custom Domain

For API Gateway custom domain:
1. Create Route53 hosted zone
2. Request/import ACM certificate
3. Add to `terraform.tfvars` and main.tf

For CloudFront custom domain:
1. Request ACM certificate in us-east-1 (required for CloudFront)
2. Update main.tf `viewer_certificate` block
3. Add Route53 alias

### Destroy Environment

⚠️ **Warning**: This deletes all resources.

```bash
terraform destroy -auto-approve
```

Or destroy specific resources:
```bash
terraform destroy -target aws_s3_bucket.frontend -auto-approve
```

## Troubleshooting

### "Error: S3 bucket already exists"

Lambda zip path may be incorrect. Verify:
```bash
ls -la artifacts/listingpilot-api.zip
```

### "Unable to load file or assembly 'Amazon.Lambda.Core'"

Lambda package missing AWS SDK dependencies. Rebuild:
```bash
cd backend
dotnet publish -c Release
```

### "Access Denied" errors

Check AWS credentials:
```bash
aws sts get-caller-identity
```

Ensure IAM user has permissions for:
- `lambda:*`
- `apigateway:*`
- `dynamodb:*`
- `s3:*`
- `cloudfront:*`
- `iam:*`
- `ssm:*`
- `cloudwatch:*`

### CloudFront still shows old content

Invalidate cache:
```bash
DIST=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"
```

Or set `CLOUDFRONT_WAIT_FOR_DEPLOYMENT = false` in `main.tf` to speed up TF operations.

## Cost Optimization

### Development
- Use on-demand DynamoDB (current)
- Lambda on standard tier
- CloudFront default pricing

### Production
- Enable Lambda reserved concurrency
- Switch DynamoDB to provisioned capacity if usage is predictable
- Enable S3 intelligent-tiering
- Use CloudFront price class `PriceClass_100` (US/EU only)

## Terraform Workspaces (Multi-Environment)

For dev/stage/prod:

```bash
terraform workspace new stage
terraform workspace select stage
# Edit terraform.tfvars for stage values
terraform apply -auto-approve
```

Then switch between:
```bash
terraform workspace select dev
terraform workspace select stage
```

Each workspace maintains separate state.

## References

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [API Gateway Pricing](https://aws.amazon.com/apigateway/pricing/)
- [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)
