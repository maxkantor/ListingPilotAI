# AWS Infrastructure (Terraform)

This stack provisions core AWS infrastructure for ListingPilot AI:

- API backend: Lambda + API Gateway (HTTP API)
- Data layer: DynamoDB
- Config/secrets: SSM Parameter Store
- Frontend (option 1): S3 + CloudFront
- Frontend (option 2): Amplify (optional)

## Prerequisites

- Terraform >= 1.6
- AWS CLI configured with deploy permissions
- Lambda deployment zip available at `lambda_zip_path`

## Files

- [providers.tf](providers.tf)
- [variables.tf](variables.tf)
- [main.tf](main.tf)
- [outputs.tf](outputs.tf)
- [terraform.tfvars.example](terraform.tfvars.example)

## Quick Start

1. Copy variables file:

- Copy [terraform.tfvars.example](terraform.tfvars.example) to `terraform.tfvars`
- Fill in real values (especially SSM secure params and repo settings)

2. Initialize and apply:

- `terraform init`
- `terraform plan`
- `terraform apply`

## Lambda package note

`aws_lambda_function.api` expects a zip at `lambda_zip_path`.

You can produce this package in CI/CD and place it under `infrastructure/terraform/artifacts/` before `terraform apply`.

## Frontend deployment options

### Option A: S3 + CloudFront

Set `create_frontend_bucket = true`.

After building frontend, upload `frontend/dist` to S3 bucket output:

- `aws s3 sync ../../frontend/dist s3://<frontend_s3_bucket_name> --delete`

Then invalidate cache:

- `aws cloudfront create-invalidation --distribution-id <cloudfront_distribution_id> --paths "/*"`

### Option B: Amplify

Set:

- `enable_amplify = true`
- `amplify_repository_url`
- `amplify_github_token_ssm_parameter_name`

Amplify will build from your repository branch.

## Outputs

Important outputs:

- `api_gateway_invoke_url`
- `cloudfront_domain_name`
- `frontend_s3_bucket_name`
- `dynamodb_table_name`
- `amplify_app_default_domain`

## Security baseline included

- Private S3 origin with CloudFront OAC
- CloudWatch logs for Lambda
- IAM least-privilege policy for Lambda (DynamoDB + SSM reads)
- SecureString support in SSM
- DynamoDB point-in-time recovery enabled
