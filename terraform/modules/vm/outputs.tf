output "private_vm_id" {
  value       = azurerm_linux_virtual_machine.private_vm.id
  description = "ID of the private VM"
}

output "vm_id" {
  description = "ID of the private VM"
  value       = azurerm_linux_virtual_machine.private_vm.id
}

output "vm_private_ip" {
  description = "Private IP address of the VM"
  value       = azurerm_network_interface.private_vm_nic.private_ip_address
}

output "vm_nic_id" {
  description = "Network interface ID of the VM"
  value       = azurerm_network_interface.private_vm_nic.id
}

output "vm_nic_ip_config_name" {
  description = "IP configuration name of the VM NIC"
  value       = "internal"
}
