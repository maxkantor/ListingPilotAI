# Production Deployment Checklist

## Pre-Production (Recommended)

- [ ] **Review Security**
  - [ ] Enable VPC endpoints for DynamoDB and S3
  - [ ] Add WAF rules to CloudFront
  - [ ] Enable AWS Shield Standard (free)
  - [ ] Rotate AWS credentials
  - [ ] Enable MFA for AWS console access

- [ ] **Configure Monitoring**
  - [ ] Set CloudWatch alarms for Lambda errors
  - [ ] Set CloudWatch alarms for API Gateway 5xx errors
  - [ ] Set CloudWatch alarms for DynamoDB throttling
  - [ ] Enable CloudTrail for audit logs
  - [ ] Set up Cost Anomaly Detection

- [ ] **Performance Testing**
  - [ ] Load test API with Apache JMeter or K6
  - [ ] Verify CloudFront cache hit ratio
  - [ ] Test Lambda cold start performance
  - [ ] Verify DynamoDB scaling behavior

- [ ] **Data Management**
  - [ ] Enable DynamoDB point-in-time recovery (backup/restore)
  - [ ] Set up DynamoDB Streams for change data capture (optional)
  - [ ] Test backup and restore procedures
  - [ ] Document data retention policies

- [ ] **Compliance**
  - [ ] Review data privacy requirements
  - [ ] Enable S3 bucket versioning and encryption
  - [ ] Enable CloudTrail logging to S3
  - [ ] Document data classification

## Production Deployment

### 1. Create Production Environment

```bash
# Create new terraform workspace
terraform workspace new prod

# Edit terraform.tfvars for production
# - aws_region = "us-east-1" (or your primary region)
# - environment = "prod"
# - lambda_memory_size = 1536
# - create_frontend_bucket = true
# - enable_amplify = true (optional, for auto-deploys)

terraform apply -auto-approve
```

### 2. Configure Production Secrets

```bash
# Set real OpenAI key (not placeholder)
aws ssm put-parameter \
  --name "/listingpilot/prod/openai/api-key" \
  --value "sk-..." \
  --type "SecureString" \
  --overwrite \
  --region us-east-1

# Set other production parameters
aws ssm put-parameter \
  --name "/listingpilot/prod/app/environment" \
  --value "prod" \
  --type "String" \
  --region us-east-1
```

### 3. Deploy Frontend

```bash
cd frontend
npm run build
aws s3 sync dist s3://listingpilot-prod-frontend-xxxx --delete --region us-east-1
aws cloudfront create-invalidation --distribution-id XXXXXX --paths "/*"
```

### 4. Verify Production

```bash
API_URL=$(terraform output -raw api_gateway_invoke_url)
curl $API_URL/api/health
# Should return: {"status":"healthy"}
```

### 5. Set Up Custom Domain

#### For API Gateway:
1. Create ACM certificate for `api.yourdomain.com`
2. Create API Gateway domain name:
   ```bash
   aws apigateway create-domain-name \
     --domain-name api.yourdomain.com \
     --certificate-arn arn:aws:acm:...
   ```
3. Create Route53 A record (alias to API Gateway)

#### For CloudFront:
1. Create ACM certificate for `yourdomain.com` in us-east-1
2. Update CloudFront distribution viewer certificate
3. Create Route53 A record (alias to CloudFront)

### 6. Enable CI/CD

#### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy Backend
        run: |
          cd backend
          dotnet publish -c Release -o publish
          cd ../infrastructure/terraform
          aws lambda update-function-code \
            --function-name listingpilot-prod-api \
            --zip-file fileb://artifacts/listingpilot-api.zip
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm ci
          npm run build
          aws s3 sync dist s3://$(terraform output -raw frontend_s3_bucket_name) --delete
          aws cloudfront create-invalidation --distribution-id $(terraform output -raw cloudfront_distribution_id) --paths "/*"
```

### 7. Set Up Monitoring Alerts

```bash
# Lambda Error Rate Alert
aws cloudwatch put-metric-alarm \
  --alarm-name listingpilot-prod-lambda-errors \
  --alarm-description "Alert if Lambda error rate > 1%" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=listingpilot-prod-api

# API Gateway 5xx Alert
aws cloudwatch put-metric-alarm \
  --alarm-name listingpilot-prod-api-5xx \
  --alarm-description "Alert if API 5xx errors" \
  --metric-name 5XXError \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 60 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

### 8. Enable Cost Controls

```bash
# Set monthly budget alert
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget-config.json \
  --notifications-with-subscribers file://notifications.json
```

Example `budget-config.json`:
```json
{
  "BudgetName": "ListingPilot-Prod",
  "BudgetLimit": {
    "Amount": "100",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

## Post-Production

- [ ] **Monitor 24/7**
  - [ ] Set up PagerDuty/Slack alerts
  - [ ] Monitor API latency dashboard
  - [ ] Monitor Lambda execution duration
  - [ ] Monitor DynamoDB consumed capacity

- [ ] **Weekly Reviews**
  - [ ] Review error logs
  - [ ] Check cost trends
  - [ ] Review user feedback
  - [ ] Verify backups

- [ ] **Monthly Maintenance**
  - [ ] Review CloudWatch logs for patterns
  - [ ] Update dependencies
  - [ ] Review security groups/policies
  - [ ] Test disaster recovery

- [ ] **Quarterly Planning**
  - [ ] Capacity planning
  - [ ] Cost optimization review
  - [ ] Security audit
  - [ ] Performance benchmarking

## Scaling Guide

### When to Scale Lambda

- If cold start time > 5 seconds: Increase `lambda_memory_size`
- If timeout errors occur: Increase `lambda_timeout`
- If concurrent limit reached: Set `reserved_concurrent_executions`

### When to Scale DynamoDB

- Current: On-demand (automatic scaling)
- For cost optimization: Switch to provisioned capacity if usage is predictable
- Monitor `ConsumedWriteCapacityUnits` and `ConsumedReadCapacityUnits` metrics

### When to Scale CloudFront

- Increase cache hit ratio by adjusting TTL
- Use geo-routing for global optimization
- Enable compression (already enabled)

## Disaster Recovery

### Backup Strategy

```bash
# Export DynamoDB table
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:ACCOUNT:table/listingpilot-prod-generation-records \
  --s3-bucket my-backup-bucket \
  --s3-prefix dynamodb-backup/
```

### Restore Procedure

1. Trigger point-in-time recovery from AWS console
2. Or restore from S3 export to new table
3. Update Lambda environment to point to restored table
4. Verify data integrity

### RTO/RPO Targets

- **RTO** (Recovery Time Objective): < 1 hour
- **RPO** (Recovery Point Objective): < 5 minutes

## Security Hardening Checklist

- [ ] Enable CloudTrail for all AWS API calls
- [ ] Enable CloudWatch Logs for Lambda
- [ ] Rotate OpenAI API key every 90 days
- [ ] Enable AWS Config for compliance tracking
- [ ] Enable VPC Flow Logs
- [ ] Add WAF rules to CloudFront
- [ ] Encrypt all data in transit (TLS 1.2+)
- [ ] Encrypt all data at rest (enabled)
- [ ] Implement API rate limiting
- [ ] Add request signing/verification

## Compliance Checklist

For Fair Housing Act compliance (real estate context):

- [ ] Do not use protected characteristics in AI prompts (race, color, religion, sex, national origin, familial status, disability)
- [ ] Document all AI decision logic
- [ ] Maintain audit trail of all generated outputs
- [ ] Regular bias testing of AI outputs
- [ ] Legal review of generated content

## Contacts & Escalation

- **AWS Support**: Premium support for production
- **Incident Response**: Define escalation path
- **Legal/Compliance**: Review Fair Housing requirements
- **Security**: Security team review for penetration testing

## Rollback Plan

If issues occur:

```bash
# Rollback Lambda to previous version
aws lambda update-function-code \
  --function-name listingpilot-prod-api \
  --s3-bucket previous-code-bucket \
  --s3-key listingpilot-api-previous.zip

# Rollback frontend
aws s3 sync s3://previous-frontend-backup dist/
aws cloudfront create-invalidation --distribution-id XXXXXX --paths "/*"

# Or destroy and redeploy
terraform destroy -auto-approve
terraform apply -auto-approve
```
