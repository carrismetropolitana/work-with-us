output "web_app_id" {
  value = azurerm_linux_web_app.this.id
}

output "web_app_name" {
  value = azurerm_linux_web_app.this.name
}

output "web_app_default_hostname" {
  value = azurerm_linux_web_app.this.default_hostname
}

output "web_app_outbound_ip_addresses" {
  value = azurerm_linux_web_app.this.outbound_ip_addresses
}
