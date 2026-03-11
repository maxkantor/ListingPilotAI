# Quick Reference - ListingPilot AI Deployed

## 🎯 Live URLs

| Resource | URL | Purpose |
|----------|-----|---------|
| **Frontend** | https://d1nlcchc6ijihw.cloudfront.net | React SPA |
| **API Base** | https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/ | REST API |
| **API Health** | https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/health | ✅ Check status |
| **Swagger Docs** | https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/swagger | API documentation |

## 📊 Resource Names

| Resource | Name |
|----------|------|
| Lambda Function | `listingpilot-dev-api` |
| DynamoDB Table | `listingpilot-dev-generation-records` |
| S3 Bucket | `listingpilot-dev-frontend-4c046924` |
| CloudFront ID | `E4FKBU22NA4KF` |
| CloudFront Domain | `d1nlcchc6ijihw.cloudfront.net` |
| API Gateway ID | `5j0abaqxa3` |
| CloudWatch Logs | `/aws/lambda/listingpilot-dev-api` |

## ⚡ Common Commands

### View Logs
```bash
aws logs tail "/aws/lambda/listingpilot-dev-api" --follow
```

### Update Lambda
```bash
cd backend
dotnet publish -c Release -o ../infrastructure/terraform/artifacts/publish
Compress-Archive ../infrastructure/terraform/artifacts/publish/* ../infrastructure/terraform/artifacts/listingpilot-api.zip
cd ../infrastructure/terraform
terraform apply -auto-approve
```

### Update Frontend
```bash
cd frontend
npm run build
aws s3 sync dist s3://listingpilot-dev-frontend-4c046924 --delete
aws cloudfront create-invalidation --distribution-id E4FKBU22NA4KF --paths "/*"
```

### Get Terraform Outputs
```bash
cd infrastructure/terraform
terraform output
```

### Test API
```bash
curl https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/health

# Generate copy
curl -X POST https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"property":{"streetAddress":"123 Main St","city":"Atlanta","state":"GA",...}}'
```

## 🔑 Configuration

### OpenAI API Key (Update Required)
```bash
aws ssm put-parameter \
  --name "/listingpilot/dev/openai/api-key" \
  --value "sk-..." \
  --type "SecureString" \
  --overwrite
```

### Check Current Key
```bash
aws ssm get-parameter --name "/listingpilot/dev/openai/api-key" --with-decryption
```

## 📈 Monitoring

### Lambda Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=listingpilot-dev-api \
  --start-time 2026-03-10T00:00:00Z \
  --end-time 2026-03-11T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### DynamoDB Status
```bash
aws dynamodb describe-table --table-name listingpilot-dev-generation-records
```

## 💰 Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Lambda | $0.20 |
| API Gateway | $0.35 |
| DynamoDB | $0-5 |
| S3/CloudFront | $0.50 |
| Other | $0.55 |
| **TOTAL** | **$1-5** |

## 🚀 Deployment Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_SUMMARY.md` | Full deployment overview |
| `DEPLOYMENT_COMPLETE.md` | Deployment details & next steps |
| `infrastructure/terraform/DEPLOYMENT_GUIDE.md` | Terraform operations guide |
| `PRODUCTION_CHECKLIST.md` | Production readiness guide |
| `infrastructure/terraform/terraform.tfvars` | Terraform variables |

## ⚠️ Important Notes

1. **OpenAI Key Required**: Update `/listingpilot/dev/openai/api-key` before using real API
2. **Mock Mode**: Works without key (returns high-quality mock outputs)
3. **Cache Invalidation**: CloudFront caches assets for 24 hours
4. **CloudWatch Retention**: Lambda logs retained for 14 days
5. **No PII**: Ensure no sensitive data in property descriptions

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 500 | Check logs: `aws logs tail "/aws/lambda/listingpilot-dev-api"` |
| Frontend shows old version | Invalidate CloudFront: `aws cloudfront create-invalidation --distribution-id E4FKBU22NA4KF --paths "/*"` |
| API too slow | Check Lambda logs, increase memory in `infrastructure/terraform/terraform.tfvars` |
| Cannot reach API | Verify CORS in API Gateway console |
| DynamoDB errors | Check Lambda IAM role has DynamoDB permissions |

## 📞 Deployment Info

- **Region**: us-east-1
- **Environment**: dev
- **Status**: ✅ Active
- **Deployed**: 2026-03-10
- **Infrastructure**: Terraform (infrastructure/terraform/)
- **Source**: GitHub

---

**TL;DR**: Frontend at `https://d1nlcchc6ijihw.cloudfront.net`, API at `https://5j0abaqxa3.execute-api.us-east-1.amazonaws.com/`. Update OpenAI key and go! 🚀
