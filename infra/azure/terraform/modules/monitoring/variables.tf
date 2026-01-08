variable "resource_group_name" {
  description = "Nome do resource group"
  type        = string
}

variable "location" {
  description = "Região dos recursos"
  type        = string
}

variable "ai_name" {
  description = "Nome do application insights"
  type        = string
}

variable "ai_application_type" {
  description = "Application type do app insights"
  type        = string
}

variable "log_name" {
  description = "Nome do log analytics workspace"
  type        = string
}

variable "log_sku" {
  description = "Tier do log analytics workspace"
  type        = string
}

variable "log_retention_in_days" {
  description = "Quantidade em dias de retenção dos logs"
  type        = string
}

variable "tags" {
  description = "Tags dos recursos"
  type        = map(string)
}