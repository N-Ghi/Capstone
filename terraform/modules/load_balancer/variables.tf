variable "lb_name" {
  type        = string
  description = "Name of the Load Balancer"
}

variable "resource_group_name" {
  type        = string
  description = "Azure Resource Group name"
}

variable "location" {
  type        = string
  description = "Azure region for the Load Balancer"
}

variable "app_vm_nic_id" {
  type        = string
  description = "ID of the VM's network interface to associate with the Load Balancer backend pool"
}

variable "app_vm_nic_ip_config_name" {
  type        = string
  description = "IP configuration name of the VM's network interface"
}
