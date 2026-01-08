resource "azurerm_resource_group" "this" {
  name     = "rg-miniapp"
  location = var.location
  tags     = local.tags
}

module "registry" {
  source = "../../modules/container_registry"

  acr_name            = "acrminiapp"
  acr_sku     = "Standard"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags
}

module "database" {
  source = "../../modules/cosmos_db"

  cosmos_name         = "cosmos-miniapp"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags
}

module "compute" {
  source = "../../modules/service_plan"
  
  service_plan_name     = "sp-miniapp"
  service_plan_sku_name = var.service_plan_sku_name
  resource_group_name   = azurerm_resource_group.this.name
  location              = azurerm_resource_group.this.location
  tags                  = local.tags
}

module "monitoring" {
  source = "../../modules/monitoring"

  ai_name               = "ai-miniapp"
  ai_application_type   = "Node.JS"
  log_name              = "log-miniapp"
  log_sku               = "PerGB2018"
  log_retention_in_days = var.log_retention_in_days
  resource_group_name   = azurerm_resource_group.this.name
  location              = azurerm_resource_group.this.location
  tags                  = local.tags
}

module "api" {
  source = "../../modules/web_app"

  app_name                 = "app-miniapp-api"
  service_plan_id          = module.compute.service_plan_id
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  docker_image_name        = "miniapp-api:latest"
  docker_registry_url      = "https://${module.registry.acr_login_server}"
  docker_registry_username = module.registry.acr_admin_username
  docker_registry_password = module.registry.acr_admin_password
  health_check_path        = "/health"
  always_on                = true
  tags                     = local.tags

  app_settings = {
    "NODE_ENV"                              = "production"
    "WEBSITES_PORT"                         = "3000"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.monitoring.ai_connection_string
  }

  connection_strings = [
    {
      name  = "MongoDB"
      type  = "Custom"
      value = module.database.cosmos_connection_string[0]
    }
  ]
}

module "frontend" {
  source = "../../modules/web_app"

  app_name                 = "app-miniapp-frontend"
  service_plan_id          = module.compute.service_plan_id
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  docker_image_name        = "miniapp-frontend:latest"
  docker_registry_url      = "https://${module.registry.acr_login_server}"
  docker_registry_username = module.registry.acr_admin_username
  docker_registry_password = module.registry.acr_admin_password
  health_check_path        = "/"
  always_on                = true
  tags                     = local.tags

  app_settings = {
    "NODE_ENV"                              = "production"
    "WEBSITES_PORT"                         = "3000"
    "NEXT_TELEMETRY_DISABLED"               = "1"
    "API_URL"                               = "https://${module.api.web_app_default_hostname}"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.monitoring.ai_connection_string
  }

  connection_strings = []
}
