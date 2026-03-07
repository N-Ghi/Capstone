terraform {
  required_version = ">= 1.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.116.0"
    }
  }
  cloud {
    organization = "Capstone-Ghislaine"
    workspaces {
      name = "Urugendo"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group (single source of truth)
resource "azurerm_resource_group" "capstone_rg" {
  name     = "Urugendo"
  location = "southafricanorth"
}

# Modules

# 1 VNet
module "vnet" {
  source              = "./modules/vnet"
  resource_group_name = azurerm_resource_group.capstone_rg.name
  location            = azurerm_resource_group.capstone_rg.location
  vnet_cidr           = "10.0.0.0/16"
  public_subnet_cidr  = "10.0.1.0/24"
  private_subnet_cidr = "10.0.2.0/24"
  my_ip               = var.my_ip
}

# 2 Bastion host
module "bastion" {
  source = "./modules/bastion"

  resource_group_name = azurerm_resource_group.capstone_rg.name
  location            = azurerm_resource_group.capstone_rg.location
  public_subnet_id    = module.vnet.public_subnet_id
  public_nsg_id       = module.vnet.public_nsg_id
  bastion_vm_name     = "bastion-vm"
  admin_username      = "azureuser"
  ssh_public_key      = var.ssh_public_key
}

# 3 Private VM (App Server)
module "private_vm" {
  source              = "./modules/vm"
  resource_group_name = azurerm_resource_group.capstone_rg.name
  location            = azurerm_resource_group.capstone_rg.location
  private_subnet_id   = module.vnet.private_subnet_id
  vm_name             = "app-vm"
  admin_username      = "azureuser"
  ssh_public_key      = var.ssh_public_key
  allowed_ssh_cidr    = module.vnet.public_subnet_cidr
}

# 4 Load Balancer (Public endpoint for app)
module "load_balancer" {
  source                    = "./modules/load_balancer"
  lb_name                   = "capstone-web-lb"
  resource_group_name       = azurerm_resource_group.capstone_rg.name
  location                  = azurerm_resource_group.capstone_rg.location
  app_vm_nic_id             = module.private_vm.vm_nic_id
  app_vm_nic_ip_config_name = module.private_vm.vm_nic_ip_config_name
}

# 5 Managed DB
module "db" {
  source                   = "./modules/db"
  resource_group_name      = azurerm_resource_group.capstone_rg.name
  location                 = azurerm_resource_group.capstone_rg.location
  admin_username           = "dbadmin"
  db_admin_password        = var.db_admin_password
  vnet_id                  = module.vnet.vnet_id
  vnet_name                = module.vnet.vnet_name
  subnet_nsg_name          = "db-subnet-nsg"
  db_subnet_address_prefix = "10.0.3.0/24"
  my_ip                    = var.my_ip
}

# 6 Container Registry
module "acr" {
  source              = "./modules/acr"
  resource_group_name = azurerm_resource_group.capstone_rg.name
  location            = azurerm_resource_group.capstone_rg.location
  acr_name            = "capstoneacr1234"
  sku                 = "Standard"
}
