# ListingPilot AI DynamoDB Modeling

This backend is structured for DynamoDB-first, low-cost serverless deployment.

## Cost Principles
- Prefer a single-table mindset with entity-specific PK/SK patterns.
- Query by access pattern first; avoid table scans in runtime code.
- Keep hot operational reads small and predictable.
- Use API Gateway + Lambda + DynamoDB on-demand for near-zero idle cost.

## Core Entity Patterns
- `TEAM#<teamId>` / `USER#<userId>` for team member lookups
- `TEAM#<teamId>` / `LISTING#<listingId>` for workspace listings
- `LISTING#<listingId>` / `ASSET#<assetType>` for generated assets
- `PIPELINE#default` / `LEAD#<leadId>` for CRM pipeline records
- `CONTACT` / `SUBMISSION#<id>` for inbound contact requests
- `DEMO` / `REQUEST#<id>` for booked demo requests
- `PLAN` / `PLAN#<planId>` for billing configuration
- `AUDIT` / `EVENT#<id>` for back-office change logs

## Suggested GSIs
- `GSI1PK = STATUS#<status>` for listings or leads by status
- `GSI1PK = PLAN#<plan>` for user/plan administration
- `GSI1PK = CONTACT#OPEN` and `DEMO#OPEN` for follow-up queues
- `GSI1PK = ASSETTYPE#<type>` for recent generated assets by output type

## Access Patterns Covered
- Recent listings for a team
- Assets for a listing
- Active users by plan/status
- CRM leads by stage
- Open demo/contact follow-up queue
- Audit timeline

## AWS Lean Stack
- Frontend: Amplify Hosting or S3 + CloudFront
- API: Lambda + API Gateway HTTP API
- Persistence: DynamoDB on-demand
- Secrets: SSM Parameter Store
- Auth: Cognito only when enabled
- Email: SES only for low-volume demo/contact follow-up
- Monitoring: CloudWatch logs + lightweight alarms

## Migration Path
The repository abstractions in `ListingPilot.Infrastructure.Repositories` let the app run in-memory today and move to DynamoDB later without changing controllers or frontend contracts.
