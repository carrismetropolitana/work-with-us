output "cosmos_connection_string" {
  value     = azurerm_cosmosdb_account.this.connection_strings[0]
  sensitive = true
}