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
