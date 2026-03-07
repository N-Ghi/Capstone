variable "my_ip" {
  type        = string
  description = "Your public IP address to allow access to the database"
  sensitive   = false
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key content for VM authentication. Multiple keys separated by newlines."
  sensitive   = true
}

variable "db_admin_password" {
  type        = string
  description = "Admin password for the database"
  sensitive   = true
}

