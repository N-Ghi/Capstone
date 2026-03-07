resource "azurerm_network_interface" "private_vm_nic" {
  name                = "${var.vm_name}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.private_subnet_id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "private_vm" {
  name                            = var.vm_name
  resource_group_name             = var.resource_group_name
  location                        = var.location
  size                            = "Standard_B1s"
  admin_username                  = var.admin_username
  disable_password_authentication = true # Require SSH keys (CKV_AZURE_149, CKV_AZURE_1, CKV_AZURE_178)

  # Support multiple SSH keys (one per line)
  dynamic "admin_ssh_key" {
    for_each = [for key in split("\n", trimspace(var.ssh_public_key)) : key if trimspace(key) != ""]
    content {
      username   = var.admin_username
      public_key = trimspace(admin_ssh_key.value)
    }
  }

  network_interface_ids = [
    azurerm_network_interface.private_vm_nic.id
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
