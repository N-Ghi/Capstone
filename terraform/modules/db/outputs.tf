output "db_id" {
  value       = azurerm_postgresql_flexible_server.dev_db.id
  description = "The ID of the managed PostgreSQL server"
}

output "db_fqdn" {
  value       = azurerm_postgresql_flexible_server.dev_db.fqdn
  description = "The fully qualified domain name of the database"
}

output "db_admin_username" {
  value       = azurerm_postgresql_flexible_server.dev_db.administrator_login
  description = "The admin username for the database"
}

output "db_subnet_id" {
  value       = azurerm_subnet.db_subnet.id
  description = "The ID of the subnet where the database is deployed"
}