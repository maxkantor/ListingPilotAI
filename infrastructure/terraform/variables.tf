variable "aws_region" {
  description = "AWS region for all infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project/service name used in resource naming"
  type        = string
  default     = "listingpilot"
}

variable "environment" {
  description = "Environment name (dev, stage, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Additional tags applied to all resources"
  type        = map(string)
  default     = {}
}

variable "lambda_zip_path" {
  description = "Path to deployment zip for Lambda function"
  type        = string
  default     = "./artifacts/listingpilot-api.zip"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "listingpilot-api"
}

variable "lambda_handler" {
  description = "Lambda handler string"
  type        = string
  default     = "ListingPilot.Api::ListingPilot.Api.LambdaEntryPoint::FunctionHandlerAsync"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "dotnet8"
}

variable "lambda_memory_size" {
  description = "Lambda memory (MB)"
  type        = number
  default     = 1024
}

variable "lambda_timeout" {
  description = "Lambda timeout (seconds)"
  type        = number
  default     = 30
}

variable "api_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "$default"
}

variable "frontend_bucket_name_override" {
  description = "Optional explicit S3 bucket name for frontend static hosting"
  type        = string
  default     = ""
}

variable "create_frontend_bucket" {
  description = "Whether to create S3 + CloudFront static frontend infrastructure"
  type        = bool
  default     = true
}

variable "ssm_plain_parameters" {
  description = "Plaintext SSM parameters to create"
  type        = map(string)
  default     = {}
}

variable "ssm_secure_parameters" {
  description = "SecureString SSM parameters to create (sensitive)"
  type        = map(string)
  sensitive   = true
  default     = {}
}

variable "openai_api_key_parameter_name" {
  description = "SSM parameter path used by Lambda to fetch OpenAI key"
  type        = string
  default     = "/listingpilot/dev/openai/api-key"
}

variable "storage_provider" {
  description = "Active backend storage provider (memory or dynamodb)"
  type        = string
  default     = "dynamodb"
}

variable "cognito_user_pool_id" {
  description = "Optional existing Cognito User Pool ID for JWT auth"
  type        = string
  default     = ""
}

variable "cognito_client_id" {
  description = "Optional existing Cognito App Client ID for JWT auth"
  type        = string
  default     = ""
}

variable "cognito_region" {
  description = "Optional Cognito region override; defaults to aws_region when empty"
  type        = string
  default     = ""
}

variable "dynamodb_table_name_override" {
  description = "Optional explicit DynamoDB table name"
  type        = string
  default     = ""
}

variable "enable_amplify" {
  description = "Whether to provision AWS Amplify app + branch"
  type        = bool
  default     = false
}

variable "amplify_app_name" {
  description = "Amplify app name"
  type        = string
  default     = "listingpilot-amplify"
}

variable "amplify_repository_url" {
  description = "Git repository URL for Amplify"
  type        = string
  default     = ""
}

variable "amplify_branch_name" {
  description = "Amplify branch to create"
  type        = string
  default     = "main"
}

variable "amplify_github_token_ssm_parameter_name" {
  description = "SSM SecureString parameter containing GitHub personal access token for Amplify"
  type        = string
  default     = ""
}

variable "cors_allow_origins" {
  description = "Allowed CORS origins for API Gateway"
  type        = list(string)
  default     = ["http://localhost:3000"]
}

# -------------------------------
# Stripe
# -------------------------------
variable "stripe_secret_key" {
  description = "Stripe secret key — written to SSM as a SecureString"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook signing secret — written to SSM as a SecureString"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  default     = ""
}

variable "stripe_secret_key_parameter_name" {
  description = "SSM parameter path for the Stripe secret key"
  type        = string
  default     = "/listingpilot/dev/stripe/secret-key"
}

variable "stripe_webhook_secret_parameter_name" {
  description = "SSM parameter path for the Stripe webhook signing secret"
  type        = string
  default     = "/listingpilot/dev/stripe/webhook-secret"
}

variable "stripe_publishable_key_parameter_name" {
  description = "SSM parameter path for the Stripe publishable key"
  type        = string
  default     = "/listingpilot/dev/stripe/publishable-key"
}

# -------------------------------
# SES
# -------------------------------
variable "ses_from_address" {
  description = "Verified SES from-address for transactional email (leave blank to skip identity creation)"
  type        = string
  default     = ""
}

variable "ses_from_address_parameter_name" {
  description = "SSM parameter path for the SES from-address"
  type        = string
  default     = "/listingpilot/dev/ses/from-address"
}

# -------------------------------
# Admin bootstrap
# -------------------------------
variable "admin_bootstrap_email" {
  description = "Bootstrap admin email address"
  type        = string
  default     = ""
}

variable "admin_bootstrap_email_parameter_name" {
  description = "SSM parameter path for the admin bootstrap email"
  type        = string
  default     = "/listingpilot/dev/admin/bootstrap-email"
}

# -------------------------------
# Cognito (create new pool)
# -------------------------------
variable "create_cognito" {
  description = "Set to true to provision a new Cognito User Pool and App Client"
  type        = bool
  default     = false
}

variable "cognito_callback_urls" {
  description = "Allowed callback URLs for the Cognito App Client"
  type        = list(string)
  default     = ["http://localhost:3000", "http://localhost:4173"]
}

variable "cognito_logout_urls" {
  description = "Allowed logout URLs for the Cognito App Client"
  type        = list(string)
  default     = ["http://localhost:3000", "http://localhost:4173"]
}
