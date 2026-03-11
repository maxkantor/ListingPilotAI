# ListingPilot AI Low-Cost AWS Architecture

## Goals

- Serverless-first deployment
- DynamoDB instead of relational infrastructure
- Low fixed monthly spend
- Launch-ready architecture with minimal ops burden

## Recommended Stack

- Frontend: AWS Amplify Hosting for simplest DX, or S3 + CloudFront for lowest ongoing hosting cost
- Backend API: AWS Lambda (.NET 8) behind API Gateway HTTP API
- Database: DynamoDB single-table design
- Auth: Amazon Cognito only when gated auth is needed
- Files and exports: Amazon S3
- Email: Amazon SES for contact/demo notifications only
- Logging: CloudWatch with structured, lightweight logs
- Scheduling: EventBridge only for low-frequency jobs like trial reminders or daily usage rollups
- Secrets: Systems Manager Parameter Store for API keys and environment configuration

## Cost-Conscious Defaults

- Prefer on-demand DynamoDB for early launch unless traffic is predictable
- Keep Lambda memory conservative and cold-start-friendly
- Use API Gateway HTTP API instead of REST API to reduce cost
- Avoid RDS, ECS, EKS, Elasticache, and other always-on services during the first launch phase
- Keep CloudWatch retention short for verbose application logs

## Deployment Shape

1. React frontend builds in CI and deploys to Amplify Hosting or S3
2. CloudFront serves the SPA globally with HTTPS
3. API Gateway routes requests to Lambda-hosted ASP.NET Core API
4. Lambda reads and writes DynamoDB items through repository abstractions
5. Parameter Store injects OpenAI key, GA config, and Cognito identifiers
6. CloudWatch captures API logs and error trends

## Launch Phases

### Phase 1: Lean launch

- Amplify or S3 + CloudFront
- One Lambda API
- One DynamoDB table
- Optional Cognito
- SES only for essential email flows

### Phase 2: Controlled scale

- Add DynamoDB GSIs only for proven access patterns
- Add EventBridge scheduled rollups for usage analytics
- Add S3 export/archive flows
- Add Lambda concurrency limits and alarms

## Environment Variables

- `OpenAI__ApiKey`
- `OpenAI__Model`
- `Frontend__AllowedOrigins__0`
- `AWS__Region`
- `Storage__Provider`
- `Cognito__UserPoolId`
- `Cognito__Region`

## Notes

- The current repository layer remains in-memory for local development and preview environments.
- The data models in `ListingPilot.Domain.Entities` are already shaped around DynamoDB partition/sort key patterns to make a production repository swap straightforward.