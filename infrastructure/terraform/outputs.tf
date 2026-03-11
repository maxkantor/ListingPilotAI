output "api_gateway_invoke_url" {
  description = "Invoke URL for API Gateway stage"
  value       = aws_apigatewayv2_stage.stage.invoke_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "dynamodb_table_name" {
  description = "DynamoDB table name for generation records"
  value       = aws_dynamodb_table.generation_records.name
}

output "frontend_s3_bucket_name" {
  description = "S3 bucket for static frontend (if enabled)"
  value       = var.create_frontend_bucket ? aws_s3_bucket.frontend[0].bucket : null
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (if enabled)"
  value       = var.create_frontend_bucket ? aws_cloudfront_distribution.frontend[0].id : null
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (if enabled)"
  value       = var.create_frontend_bucket ? aws_cloudfront_distribution.frontend[0].domain_name : null
}

output "amplify_app_id" {
  description = "Amplify App ID (if enabled)"
  value       = var.enable_amplify ? aws_amplify_app.this[0].id : null
}

output "amplify_app_default_domain" {
  description = "Amplify default domain (if enabled)"
  value       = var.enable_amplify ? aws_amplify_app.this[0].default_domain : null
}
