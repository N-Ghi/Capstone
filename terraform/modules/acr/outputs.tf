output "acr_id" {
  value       = azurerm_container_registry.acr.id
  description = "The ID of the ACR"
}

output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "The login server URL for ACR"
}

output "acr_admin_username" {
  value       = azurerm_container_registry.acr.admin_username
  description = "Admin username for ACR"
}

output "acr_admin_password" {
  value       = azurerm_container_registry.acr.admin_password
  description = "Admin password for ACR"
  sensitive   = true
}
