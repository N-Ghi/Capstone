output "load_balancer_public_ip" {
  description = "Public IP address of the load balancer"
  value       = azurerm_public_ip.lb_public_ip.ip_address
}

output "load_balancer_id" {
  description = "ID of the load balancer"
  value       = azurerm_lb.web_lb.id
}

output "app_url" {
  description = "URL to access the application"
  value       = "http://${azurerm_public_ip.lb_public_ip.ip_address}"
}