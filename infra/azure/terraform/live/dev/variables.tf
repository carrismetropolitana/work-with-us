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
  default     = "dev"
}

variable "api_health_check_path" {
  description = "Endpoint healthcheck da api"
  type = string
  default = "/health"
}