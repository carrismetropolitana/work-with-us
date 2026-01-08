variable "app_name" {
  description = "Nome do web app"
  type        = string
}

variable "service_plan_id" {
  description = "Id do service plan dos web apps"
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

variable "docker_image_name" {
  description = "Nome da imagem no ACR"
  type        = string
}

variable "docker_registry_url" {
  description = "URL do ACR"
  type        = string
}

variable "docker_registry_username" {
  description = "Username do ACR"
  type        = string
  sensitive   = true
}

variable "docker_registry_password" {
  description = "Password do ACR"
  type        = string
  sensitive   = true
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "always_on" {
  description = "Always on"
  type        = bool
}

variable "app_settings" {
  description = "App settings do web app"
  type        = map(string)
}

variable "connection_strings" {
  description = "Connection strings do web app"
  type = list(object({
    name  = string
    type  = string
    value = string
  }))
  default = []
}

variable "tags" {
  description = "Tags dos recursos"
  type        = map(string)
}
