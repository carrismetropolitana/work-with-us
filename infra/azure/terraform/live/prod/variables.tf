variable "location" {
  description = "Região dos recursos"
  type        = string
  default     = "eastus"
}

variable "service_plan_sku_name" {
  description = "SKU do service plan"
  type        = string
  default     = "P0v4"
}

variable "log_retention_in_days" {
  description = "Quantidade em dias de retenção dos logs"
  type        = string
  default     = "90"
}