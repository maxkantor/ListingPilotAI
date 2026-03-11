# ListingPilot AI DynamoDB Access Patterns

## Single-Table Strategy

Use one primary table with generic keys:

- `pk` = entity collection or tenant anchor
- `sk` = entity type and record identifier
- `entityType` = application discriminator
- `gsi1pk` / `gsi1sk` = first alternate query pattern

## Core Entities

### User

- `pk = TEAM#{teamId}`
- `sk = USER#{userId}`
- `gsi1pk = PLAN#{planName}`
- `gsi1sk = STATUS#{status}`

### Team

- `pk = ORG#{orgId}` or `TEAM#{teamId}`
- `sk = TEAM#{teamId}`

### ListingProject

- `pk = TEAM#{teamId}`
- `sk = LISTING#{listingId}`
- `gsi1pk = STATUS#{status}`
- `gsi1sk = {updatedAt}`

### GeneratedAsset

- `pk = LISTING#{listingId}`
- `sk = ASSET#{assetType}#{assetId}`
- `gsi1pk = ASSETTYPE#{assetType}`
- `gsi1sk = {updatedAt}`

### Lead

- `pk = PIPELINE#{teamId}`
- `sk = LEAD#{leadId}`
- `gsi1pk = STAGE#{stage}`
- `gsi1sk = {updatedAt}`

### ContactSubmission / DemoRequest

- `pk = INBOUND#{yyyyMM}`
- `sk = CONTACT#{submissionId}` or `DEMO#{requestId}`
- `gsi1pk = SOURCE#{source}`
- `gsi1sk = {createdAt}`

### AdminNote

- `pk = TARGET#{targetType}#{targetId}`
- `sk = NOTE#{createdAt}#{noteId}`

### UsageEvent

- `pk = USER#{userId}`
- `sk = USAGE#{createdAt}#{eventId}`
- `gsi1pk = EVENT#{eventName}`
- `gsi1sk = {createdAt}`

### SubscriptionPlan

- `pk = PLAN`
- `sk = PLAN#{planId}`

### AuditEvent

- `pk = AUDIT`
- `sk = EVENT#{createdAt}#{auditId}`

## Query-First Patterns

- Get all listings for a team
- Get all assets for a listing
- Get all users for a team
- Filter users by plan/status using GSI
- Get leads by stage using GSI
- Fetch recent audit events
- Fetch recent inbound contact/demo activity by month bucket

## Cost Controls

- Avoid scan-heavy analytics in the request path
- Use write-time denormalization for dashboard counters when real billing arrives
- Bucket large inbound collections by month
- Keep item sizes small; store large exports in S3
- Add GSIs only after proving the access pattern in production

## Repository Guidance

- Keep repository interfaces query-oriented, not ORM-oriented
- Return shape-specific results for admin dashboards instead of generic table scans
- Preserve the current in-memory repositories for local dev and visual review environments