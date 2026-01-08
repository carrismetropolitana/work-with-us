variable "location" {
  description = "Região dos recursos"
  type        = string
  default     = "eastus"
}

variable "service_plan_sku_name" {
  description = "SKU do service plan"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
  default     = "staging"
}