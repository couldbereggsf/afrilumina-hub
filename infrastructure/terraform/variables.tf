variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-west-2"  # London — good latency for Africa
}
// This variable is used to define the RDS instance class
variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "afrilumina"
}
// This variable is used to define the RDS instance class
variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}
// This variable is used to define the RDS master username
variable "db_username" {
  description = "RDS master username"
  type        = string
  sensitive   = true
}

variable "db_password" { // This variable is used to define the RDS master password
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "app_runner_service_name" { // This variable is used to define the name of the App Runner service
  description = "Name of the App Runner service"
  type        = string
  default     = "afrilumina-backend"
}