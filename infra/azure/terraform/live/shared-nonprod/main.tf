module "acr" {
  source = "../../modules/container_registry"

  acr_name            = "miniapp"
  acr_sku             = "Basic"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags
}

module "cosmos_db" {
  source = "../../modules/cosmos_db"

  cosmos_name         = "cosmos-miniapp-nonprod"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags
}
