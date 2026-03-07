output "acr_login_server" {
  value = module.acr.acr_login_server
}

# output "private_vm_ip" {
#   value = module.private_vm.private_vm_private_ip
# }

output "db_fqdn" {
  value = module.db.db_fqdn
}

output "bastion_public_ip" {
  description = "Public IP of bastion host for SSH access"
  value       = module.bastion.bastion_public_ip
}

output "bastion_ssh_command" {
  description = "SSH command to connect to bastion"
  value       = module.bastion.bastion_ssh_command
}

output "app_vm_private_ip" {
  description = "Private IP of app VM"
  value       = module.private_vm.vm_private_ip
}

output "load_balancer_public_ip" {
  description = "Public IP of load balancer - use this to access your web app"
  value       = module.load_balancer.load_balancer_public_ip
}

output "app_url" {
  description = "URL to access your web application"
  value       = "http://${module.load_balancer.load_balancer_public_ip}"
}
