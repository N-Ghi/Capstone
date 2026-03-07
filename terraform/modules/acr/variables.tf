variable "resource_group_name" {
  type        = string
  description = "Azure Resource Group name"
}

variable "location" {
  type        = string
  description = "Azure region for the container registry"
}

variable "acr_name" {
  type        = string
  description = "Name of the Azure Container Registry"
}

variable "sku" {
  type        = string
  default     = "Basic"
  description = "SKU of the ACR (Basic, Standard, Premium)"
}
