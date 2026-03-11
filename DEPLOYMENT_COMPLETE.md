# AWS Deployment Complete

## Deployment Summary

ListingPilot AI is now fully deployed to AWS with production infrastructure.

### Resources Deployed

#### Compute
- **Lambda**: `listingpilot-dev-api` (dotnet8, 1GB RAM, 30s timeout)
- **API Gateway HTTP API**: `listingpilot-dev-http-api`
- **Handler**: Amazon.Lambda.AspNetCoreServer (managed automatic routing)

#### Data
- **DynamoDB**: `listingpilot-dev-generation-records` (on-demand billing, PITR enabled)
- **SSM Parameter Store**: 
  - `/listingpilot/dev/app/environment` (String)
  - `/listingpilot/dev/openai/api-key` (SecureString)

#### Frontend Hosting
- **S3**: `listingpilot-dev-frontend-4c046924` (private, versioned, encrypted)
- **CloudFront**: `d1nlcchc6ijihw.cloudfront.net` (distribution ID: `E4FKBU22NA4KF`)

#### Security & Monitoring
- **IAM**: Lambda execution role with least-privilege policies (DynamoDB + SSM read)
- **CloudWatch**: Lambda logs at `/aws/lambda/listingpilot-dev-api` (14-day retention)
- **CloudFront OAC**: Origin Access Control for private S3 access

---

## Endpoints

### API
```
Base URL: https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/
Health: GET https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/health
Generate: POST https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/generate
History: GET https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/history
Sample: GET https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/sample-property
```

### Frontend
```
CloudFront: https://d1nlcchc6ijihw.cloudfront.net
S3 Bucket: listingpilot-dev-frontend-4c046924
```

---

## Test Results

✅ **API Health**: Verified working
```
curl https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/health
# Returns: {"status":"healthy"}
```

✅ **Frontend**: Deployed to S3 and CloudFront (200 OK)

---

## Post-Deployment Configuration

### 1. Update OpenAI API Key

```bash
aws ssm put-parameter \
  --name "/listingpilot/dev/openai/api-key" \
  --value "sk-..." \
  --type "SecureString" \
  --overwrite
```

Replace `sk-...` with your actual OpenAI API key. Lambda will automatically read it.

### 2. Configure Custom Domain (optional)

For CloudFront, create a CloudFront alias in Route53:
```
A record: yourdomain.com -> d1nlcchc6ijihw.cloudfront.net
```

For API Gateway, attach a custom domain via API Gateway console or Terraform.

### 3. Enable CI/CD

Both backend and frontend can be updated via:

**Backend**:
1. Publish locally: `dotnet publish -c Release`
2. Create zip: `Compress-Archive -Path "publish/*" -DestinationPath "api.zip"`
3. Deploy: `aws lambda update-function-code --function-name listingpilot-dev-api --zip-file fileb://api.zip`

**Frontend**:
1. Build locally: `npm run build`
2. Upload to S3: `aws s3 sync dist s3://listingpilot-dev-frontend-4c046924 --delete`
3. Invalidate cache: `aws cloudfront create-invalidation --distribution-id E4FKBU22NA4KF --paths "/*"`

Or use Terraform to redeploy after code changes.

---

## Monitoring

### Lambda Logs
```bash
aws logs tail "/aws/lambda/listingpilot-dev-api" --follow
```

### CloudWatch Insights Query
```sql
fields @timestamp, @message, @duration
| filter @message like /error/i
| stats count() by @message
```

### Lambda Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=listingpilot-dev-api \
  --start-time 2026-03-10T00:00:00Z \
  --end-time 2026-03-11T00:00:00Z \
  --period 3600 \
  --statistics Sum,Average
```

---

## Cost Estimation (Monthly)

- **Lambda**: ~$0.20 (free tier: 1M requests/month)
- **API Gateway**: ~$0.35 (1M requests at $0.35/M)
- **DynamoDB**: ~$0 - $5 (on-demand, pay per request)
- **S3**: ~$0.50 (storage + requests)
- **CloudFront**: ~$0 (free tier: 1TB egress/month)
- **SSM**: ~$0.05 (parameter management)

**Total: ~$1-5/month** for dev environment (scales with usage)

---

## Scaling & Production Readiness

Current setup is suitable for:
- ✅ Development/testing
- ✅ Small-scale deployments (<100 requests/minute)
- ✅ Pay-as-you-go pricing

For production, consider:
- [ ] Enable Lambda provisioned concurrency
- [ ] Use DynamoDB on-demand or reserved capacity
- [ ] Add API Gateway request throttling
- [ ] Configure CloudWatch alarms for errors
- [ ] Set up AWS Backup for DynamoDB
- [ ] Enable Lambda function versioning + aliases
- [ ] Add WAF to CloudFront for DDoS protection

---

## Rollback

To revert to local development:

```bash
# Frontend
npm run dev

# Backend
dotnet run --project backend/src/ListingPilot.Api
```

Or destroy AWS resources:
```bash
cd infrastructure/terraform
terraform destroy -auto-approve
```

---

## Next Steps

1. ✅ **Share API endpoint** with team: `https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/`
2. ✅ **Share frontend URL** with stakeholders: `https://d1nlcchc6ijihw.cloudfront.net`
3. ⏭️ **Configure OpenAI API key** in SSM Parameter Store
4. ⏭️ **Set up CI/CD pipeline** (GitHub Actions, GitLab CI, or AWS CodePipeline)
5. ⏭️ **Enable Amplify** for automated frontend deployments (optional)
6. ⏭️ **Add authentication** (Cognito, Auth0, or Okta) - patterns documented in ARCHITECTURE.md
7. ⏭️ **Set up billing alerts** in AWS Cost Explorer

---

## Files Modified

- [backend/src/ListingPilot.Api/ListingPilot.Api.csproj](../../backend/src/ListingPilot.Api/ListingPilot.Api.csproj) - Added Lambda hosting packages
- [backend/src/ListingPilot.Api/Program.cs](../../backend/src/ListingPilot.Api/Program.cs) - Added ASP.NET Lambda hosting
- [infrastructure/terraform/terraform.tfvars](terraform.tfvars) - Created with dev values
- [infrastructure/terraform/main.tf](main.tf) - Fixed sensitive variable handling

---

## Support

For issues, check:
1. CloudWatch logs: `aws logs tail "/aws/lambda/listingpilot-dev-api"`
2. Lambda test invoke: `aws lambda invoke --function-name listingpilot-dev-api --payload '{}' response.json`
3. API Gateway execution logs in AWS Console
