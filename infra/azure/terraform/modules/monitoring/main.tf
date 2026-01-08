resource "azurerm_log_analytics_workspace" "this" {
  name                = var.log_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.log_sku
  retention_in_days   = var.log_retention_in_days
  tags                = var.tags
}

resource "azurerm_application_insights" "this" {
  name                = var.ai_name
  resource_group_name = var.resource_group_name
  location            = var.location
  workspace_id        = azurerm_log_analytics_workspace.this.id
  application_type    = var.ai_application_type
  tags                = var.tags
}