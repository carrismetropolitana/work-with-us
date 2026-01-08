variable "service_plan_name" {
  description = "Nome do service plan"
  type        = string
}

variable "resource_group_name" {
  description = "Nome do resource group"
  type        = string
}

variable "location" {
  description = "Região dos recursos"
  type        = string
}

variable "service_plan_sku_name" {
  description = "SKU do service plan"
  type        = string
}

variable "tags" {
  description = "Tags dos recursos"
  type        = map(string)
}