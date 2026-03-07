# Network Interface for Bastion VM with Public IP
resource "azurerm_network_interface" "bastion_nic" {
  name                = "${var.bastion_vm_name}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.public_subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.bastion_public_ip.id
  }
}

# Public IP for Bastion VM
resource "azurerm_public_ip" "bastion_public_ip" {
  name                = "${var.bastion_vm_name}-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# Bastion Linux VM (Jump Box)
resource "azurerm_linux_virtual_machine" "bastion_vm" {
  name                            = var.bastion_vm_name
  resource_group_name             = var.resource_group_name
  location                        = var.location
  size                            = "Standard_B1s"
  admin_username                  = var.admin_username
  disable_password_authentication = true

  # SSH key authentication only
  dynamic "admin_ssh_key" {
    for_each = [for key in split("\n", trimspace(var.ssh_public_key)) : key if trimspace(key) != ""]
    content {
      username   = var.admin_username
      public_key = trimspace(admin_ssh_key.value)
    }
  }

  network_interface_ids = [
    azurerm_network_interface.bastion_nic.id
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}

# Associate Bastion NIC with Public NSG
resource "azurerm_network_interface_security_group_association" "bastion_nic_nsg_assoc" {
  network_interface_id      = azurerm_network_interface.bastion_nic.id
  network_security_group_id = var.public_nsg_id
}
