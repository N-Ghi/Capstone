output "bastion_vm_id" {
  value       = azurerm_linux_virtual_machine.bastion_vm.id
  description = "ID of the Bastion VM"
}

output "bastion_public_ip" {
  description = "Public IP address of the bastion host"
  value       = azurerm_public_ip.bastion_public_ip.ip_address
}

output "bastion_ssh_command" {
  description = "SSH command to connect to bastion"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.bastion_public_ip.ip_address}"
}
