data "azurerm_container_registry" "shared" {
  name                = "acrminiappnonprod"
  resource_group_name = "rg-miniapp-nonprod"
}

data "azurerm_cosmosdb_account" "shared" {
  name                = "cosmos-miniapp-nonprod"
  resource_group_name = "rg-miniapp-nonprod"
}

resource "azurerm_resource_group" "this" {
  name     = "rg-miniapp-${var.environment}"
  location = var.location
  tags     = local.tags
}

module "compute" {
  source = "../../modules/service_plan"

  service_plan_name     = "sp-miniapp-${var.environment}"
  service_plan_sku_name = var.service_plan_sku_name
  resource_group_name   = azurerm_resource_group.this.name
  location              = azurerm_resource_group.this.location
  tags                  = local.tags
}

module "monitoring" {
  source = "../../modules/monitoring"

  ai_name               = "ai-miniapp-${var.environment}"
  ai_application_type   = "Node.JS"
  log_name              = "log-miniapp-${var.environment}"
  log_sku               = "PerGB2018"
  log_retention_in_days = "30"
  resource_group_name   = azurerm_resource_group.this.name
  location              = azurerm_resource_group.this.location
  tags                  = local.tags
}

module "api" {
  source = "../../modules/web_app"

  app_name                 = "app-miniapp-api-${var.environment}"
  service_plan_id          = module.service_plan.service_plan_id
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  docker_image_name        = "miniapp-api:latest"
  docker_registry_url      = "https://${data.azurerm_container_registry.shared.login_server}"
  docker_registry_username = data.azurerm_container_registry.shared.admin_username
  docker_registry_password = data.azurerm_container_registry.shared.admin_password
  health_check_path        = var.api_health_check_path
  always_on                = false
  tags                     = local.tags

  app_settings = {
    "NODE_ENV"                              = "development"
    "WEBSITES_PORT"                         = "3000"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.monitoring.ai_connection_string
  }

  connection_strings = [
    {
      name  = "MongoDB"
      type  = "Custom"
      value = data.azurerm_cosmosdb_account.shared.connection_strings[0]
    }
  ]
}

module "frontend" {
  source = "../../modules/web_app"

  app_name                 = "app-miniapp-frontend-${var.environment}"
  service_plan_id          = module.service_plan.service_plan_id
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  docker_image_name        = "miniapp-frontend:latest"
  docker_registry_url      = "https://${data.azurerm_container_registry.shared.login_server}"
  docker_registry_username = data.azurerm_container_registry.shared.admin_username
  docker_registry_password = data.azurerm_container_registry.shared.admin_password
  health_check_path        = "/"
  always_on                = false
  tags                     = local.tags

  app_settings = {
    "NODE_ENV"                              = "development"
    "WEBSITES_PORT"                         = "3000"
    "NEXT_TELEMETRY_DISABLED"               = "1"
    "API_URL"                               = "https://${module.web_app_api.web_app_default_hostname}"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.monitoring.ai_connection_string
  }

  connection_strings = []
}
