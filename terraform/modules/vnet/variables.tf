variable "vnet_cidr" {
  type        = string
  description = "CIDR block for the Virtual Network"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the public subnet"
}

variable "private_subnet_cidr" {
  type        = string
  description = "CIDR block for the private subnet"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the Azure Resource Group"
}

variable "location" {
  type        = string
  description = "Azure region for the resources"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH into VMs (usually bastion subnet CIDR)"
  default     = ""
}

variable "my_ip" {
  type        = string
  description = "Your public IP address to allow access to the database"
}
