data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_partition" "current" {}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  prefix = "${var.project_name}-${var.environment}"

  frontend_bucket_name = var.frontend_bucket_name_override != "" ? var.frontend_bucket_name_override : "${local.prefix}-frontend-${random_id.suffix.hex}"

  dynamodb_table_name = var.dynamodb_table_name_override != "" ? var.dynamodb_table_name_override : "${local.prefix}-generation-records"

  lambda_name = "${local.prefix}-${var.lambda_function_name}"

  effective_cognito_pool_id   = var.create_cognito ? aws_cognito_user_pool.main[0].id : var.cognito_user_pool_id
  effective_cognito_client_id = var.create_cognito ? aws_cognito_user_pool_client.main[0].id : var.cognito_client_id

  common_env_vars = {
    ASPNETCORE_ENVIRONMENT                  = title(var.environment)
    Storage__Provider                       = var.storage_provider
    DynamoDb__TableName                     = aws_dynamodb_table.generation_records.name
    GENERATION_TABLE_NAME                   = aws_dynamodb_table.generation_records.name
    OPENAI_API_KEY_PARAMETER_NAME           = var.openai_api_key_parameter_name
    Auth__CognitoUserPoolId                 = local.effective_cognito_pool_id
    Auth__CognitoClientId                   = local.effective_cognito_client_id
    Auth__CognitoRegion                     = var.cognito_region != "" ? var.cognito_region : var.aws_region
    Stripe__SecretKeyParameterName          = var.stripe_secret_key_parameter_name
    Stripe__WebhookSecretParameterName      = var.stripe_webhook_secret_parameter_name
    Stripe__PublishableKeyParameterName     = var.stripe_publishable_key_parameter_name
    Ses__FromAddressParameterName           = var.ses_from_address_parameter_name
    Admin__BootstrapEmailParameterName      = var.admin_bootstrap_email_parameter_name
  }
}

# -------------------------------
# DynamoDB
# -------------------------------
resource "aws_dynamodb_table" "generation_records" {
  name         = local.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "TTL"
    enabled        = false
  }

  point_in_time_recovery {
    enabled = true
  }
}

# -------------------------------
# SSM Parameters
# -------------------------------
resource "aws_ssm_parameter" "plain" {
  for_each = var.ssm_plain_parameters

  name  = each.key
  type  = "String"
  value = each.value
}

resource "aws_ssm_parameter" "secure" {
  for_each = nonsensitive(var.ssm_secure_parameters)

  name  = each.key
  type  = "SecureString"
  value = each.value
}

# -------------------------------
# IAM for Lambda
# -------------------------------
resource "aws_iam_role" "lambda_exec" {
  name = "${local.prefix}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_data_access" {
  name = "${local.prefix}-lambda-data-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDbAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.generation_records.arn,
          "${aws_dynamodb_table.generation_records.arn}/index/*"
        ]
      },
      {
        Sid    = "SsmReadAccess"
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/listingpilot/${var.environment}/*",
          "arn:${data.aws_partition.current.partition}:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter${var.openai_api_key_parameter_name}"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_data_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_data_access.arn
}

# -------------------------------
# Lambda
# -------------------------------
resource "aws_lambda_function" "api" {
  function_name = local.lambda_name
  role          = aws_iam_role.lambda_exec.arn
  runtime       = var.lambda_runtime
  handler       = var.lambda_handler
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout

  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = local.common_env_vars
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy_attachment.lambda_data_access
  ]
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 14
}

# -------------------------------
# API Gateway HTTP API
# -------------------------------
resource "aws_apigatewayv2_api" "http" {
  name          = "${local.prefix}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.cors_allow_origins
    allow_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_headers = ["content-type", "authorization", "x-requested-with", "x-anonymous-id"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = var.api_stage_name
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

# -------------------------------
# Frontend Hosting (S3 + CloudFront)
# -------------------------------
resource "aws_s3_bucket" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  bucket = local.frontend_bucket_name
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  bucket                  = aws_s3_bucket.frontend[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  bucket = aws_s3_bucket.frontend[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  bucket = aws_s3_bucket.frontend[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_control" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  name                              = "${local.prefix}-frontend-oac"
  description                       = "OAC for private S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${local.prefix} frontend distribution"

  origin {
    domain_name              = aws_s3_bucket.frontend[0].bucket_regional_domain_name
    origin_id                = "s3-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend[0].id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-frontend"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  count = var.create_frontend_bucket ? 1 : 0

  bucket = aws_s3_bucket.frontend[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontRead"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.frontend[0].arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend[0].arn
          }
        }
      }
    ]
  })
}

# -------------------------------
# Optional Amplify App
# -------------------------------
data "aws_ssm_parameter" "amplify_github_token" {
  count           = var.enable_amplify && var.amplify_github_token_ssm_parameter_name != "" ? 1 : 0
  name            = var.amplify_github_token_ssm_parameter_name
  with_decryption = true
}

resource "aws_amplify_app" "this" {
  count = var.enable_amplify ? 1 : 0

  name       = "${local.prefix}-${var.amplify_app_name}"
  repository = var.amplify_repository_url

  access_token = var.amplify_github_token_ssm_parameter_name != "" ? data.aws_ssm_parameter.amplify_github_token[0].value : null

  build_spec = <<-EOT
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install --prefix frontend
    build:
      commands:
        - npm run build --prefix frontend
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
EOT

  enable_branch_auto_build = true

  environment_variables = {
    VITE_API_BASE_URL = aws_apigatewayv2_stage.stage.invoke_url
  }

  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "404-200"
  }
}

resource "aws_amplify_branch" "main" {
  count = var.enable_amplify ? 1 : 0

  app_id      = aws_amplify_app.this[0].id
  branch_name = var.amplify_branch_name
  stage       = var.environment == "dev" ? "DEVELOPMENT" : upper(var.environment)
}

# -------------------------------
# Stripe SSM Parameters
# -------------------------------
resource "aws_ssm_parameter" "stripe_secret_key" {
  count = var.stripe_secret_key != "" ? 1 : 0

  name  = var.stripe_secret_key_parameter_name
  type  = "SecureString"
  value = var.stripe_secret_key

  tags = var.tags
}

resource "aws_ssm_parameter" "stripe_webhook_secret" {
  count = var.stripe_webhook_secret != "" ? 1 : 0

  name  = var.stripe_webhook_secret_parameter_name
  type  = "SecureString"
  value = var.stripe_webhook_secret

  tags = var.tags
}

resource "aws_ssm_parameter" "stripe_publishable_key" {
  count = var.stripe_publishable_key != "" ? 1 : 0

  name  = var.stripe_publishable_key_parameter_name
  type  = "String"
  value = var.stripe_publishable_key

  tags = var.tags
}

# -------------------------------
# SES Email Identity (optional)
# -------------------------------
resource "aws_ses_email_identity" "from" {
  count = var.ses_from_address != "" ? 1 : 0

  email = var.ses_from_address
}

resource "aws_ssm_parameter" "ses_from_address" {
  count = var.ses_from_address != "" ? 1 : 0

  name  = var.ses_from_address_parameter_name
  type  = "String"
  value = var.ses_from_address

  tags = var.tags
}

# -------------------------------
# Admin Bootstrap Email SSM
# -------------------------------
resource "aws_ssm_parameter" "admin_bootstrap_email" {
  count = var.admin_bootstrap_email != "" ? 1 : 0

  name  = var.admin_bootstrap_email_parameter_name
  type  = "String"
  value = var.admin_bootstrap_email

  tags = var.tags
}

# -------------------------------
# Cognito User Pool (optional)
# Set create_cognito = true to provision a new pool.
# Leave false and supply cognito_user_pool_id / cognito_client_id
# to use an existing pool.
# -------------------------------
resource "aws_cognito_user_pool" "main" {
  count = var.create_cognito ? 1 : 0

  name = "${local.prefix}-users"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 3
      max_length = 320
    }
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = var.tags
}

resource "aws_cognito_user_pool_client" "main" {
  count        = var.create_cognito ? 1 : 0
  name         = "${local.prefix}-web-client"
  user_pool_id = aws_cognito_user_pool.main[0].id

  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  callback_urls = var.cognito_callback_urls
  logout_urls   = var.cognito_logout_urls

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30
}

resource "aws_cognito_user_group" "admin" {
  count        = var.create_cognito ? 1 : 0
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.main[0].id
  description  = "Platform administrators"
}

