variable "aws_region" {
  default = "ap-southeast-1"
}

variable "key_name" {
  description = "AWS Key Pair"
}

variable "instance_type" {
  default = "c7i-flex.large"
}

locals {
  common_tags = {
    Project     = "UniResearch"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}