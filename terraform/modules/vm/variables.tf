variable "resource_group_name" {
  type        = string
  description = "Azure Resource Group name"
}

variable "private_subnet_id" {
  type        = string
  description = "ID of the private subnet where VM will reside"
}

variable "vm_name" {
  type        = string
  description = "Name of the VM"
}

variable "admin_username" {
  type        = string
  description = "Admin username for the VM"
}

variable "location" {
  type        = string
  description = "Azure region for the VM"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH into the VM, usually the Bastion subnet CIDR"
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key content for VM authentication. Can contain multiple keys separated by newlines."
  sensitive   = true
}