terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    # Will be configured after bucket creation
    # bucket = "afrilumina-terraform-state"
    # key    = "terraform.tfstate"
    # region = "eu-west-2"
  }
}

variable "aws_region" {
  description = "AWS region for resources and provider configuration"
  type        = string
  default     = "eu-west-2"
}

provider "aws" {
  region = var.aws_region
}