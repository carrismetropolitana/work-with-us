variable "acr_name" {
  description = "Nome do container registry"
  type        = string
}

variable "acr_sku" {
  description = "SKU do container registry"
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

variable "tags" {
  description = "Tags dos recursos"
  type        = map(string)
}