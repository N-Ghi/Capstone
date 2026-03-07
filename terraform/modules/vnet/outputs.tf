output "vnet_id" {
  value       = azurerm_virtual_network.main.id
  description = "The ID of the Virtual Network"
}

output "vnet_name" {
  description = "The name of the virtual network"
  value       = azurerm_virtual_network.main.name
}

output "public_subnet_id" {
  value       = azurerm_subnet.public.id
  description = "The ID of the public subnet"
}

output "private_subnet_id" {
  value       = azurerm_subnet.private.id
  description = "The ID of the private subnet"
}

output "public_subnet_cidr" {
  value       = var.public_subnet_cidr
  description = "The CIDR block of the public subnet"
}

output "private_subnet_cidr" {
  description = "CIDR block of private subnet"
  value       = var.private_subnet_cidr
}

output "public_nsg_id" {
  description = "ID of the public Network Security Group"
  value       = azurerm_network_security_group.public_nsg.id
}

output "private_nsg_id" {
  description = "ID of the private NSG"
  value       = azurerm_network_security_group.private_nsg.id
}