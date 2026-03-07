variable "resource_group_name" {
  type        = string
  description = "Azure Resource Group name"
}

variable "location" {
  type        = string
  description = "Azure region for the database"
}

variable "admin_username" {
  type        = string
  description = "Database admin username"
}

variable "db_admin_password" {
  type        = string
  sensitive   = true
  description = "Database admin password"
}

variable "vnet_id" {
  description = "ID of the virtual network"
  type        = string
}

variable "vnet_name" {
  description = "Name of the virtual network"
  type        = string
}

variable "db_subnet_address_prefix" {
  type        = string
  description = "Address prefix for the PostgreSQL delegated subnet (example: 10.0.3.0/24)"
}

variable "subnet_nsg_name" {
  type        = string
  description = "Name of the NSG attached to the database subnet"
}

variable "private_dns_zone_name" {
  type        = string
  description = "Private DNS zone used for the PostgreSQL private endpoint"
  default     = "privatelink.postgres.database.azure.com"
}

variable "my_ip" {
  type        = string
  description = "Your public IP address to allow access to the database"
}
