# Public IP for Load Balancer
resource "azurerm_public_ip" "lb_public_ip" {
  name                = "${var.lb_name}-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  domain_name_label   = "urugendo-app"
}

# Load Balancer
resource "azurerm_lb" "web_lb" {
  name                = var.lb_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.lb_public_ip.id
  }
}

# Backend Address Pool
resource "azurerm_lb_backend_address_pool" "web_backend_pool" {
  loadbalancer_id = azurerm_lb.web_lb.id
  name            = "web-backend-pool"
}

# Associate VM NIC with Backend Pool
resource "azurerm_network_interface_backend_address_pool_association" "web_nic_lb_assoc" {
  network_interface_id    = var.app_vm_nic_id
  ip_configuration_name   = var.app_vm_nic_ip_config_name
  backend_address_pool_id = azurerm_lb_backend_address_pool.web_backend_pool.id
}

# Health Probe for Backend API (port 8000)
resource "azurerm_lb_probe" "backend_probe" {
  loadbalancer_id     = azurerm_lb.web_lb.id
  name                = "backend-health-probe"
  protocol            = "Tcp"
  port                = 8000
  interval_in_seconds = 15
  number_of_probes    = 2
}

# HTTP probe
resource "azurerm_lb_probe" "http_probe" {
  loadbalancer_id     = azurerm_lb.web_lb.id
  name                = "http-health-probe"
  protocol            = "Tcp"
  port                = 80
  interval_in_seconds = 15
  number_of_probes    = 2
}

# TCP probe we created manually
resource "azurerm_lb_probe" "tcp_probe" {
  loadbalancer_id     = azurerm_lb.web_lb.id
  name                = "tcp-health-probe"
  protocol            = "Tcp"
  port                = 80
  interval_in_seconds = 15
  number_of_probes    = 2
}

# Tcp-health-probe rules
resource "azurerm_lb_rule" "http_rule" {
  loadbalancer_id                = azurerm_lb.web_lb.id
  name                           = "HTTP"
  protocol                       = "Tcp"
  frontend_port                  = 80
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
  backend_address_pool_ids       = [azurerm_lb_backend_address_pool.web_backend_pool.id]
  probe_id                       = azurerm_lb_probe.tcp_probe.id
  enable_tcp_reset               = true
  idle_timeout_in_minutes        = 4
}

resource "azurerm_lb_rule" "https_rule" {
  loadbalancer_id                = azurerm_lb.web_lb.id
  name                           = "HTTPS"
  protocol                       = "Tcp"
  frontend_port                  = 443
  backend_port                   = 443
  frontend_ip_configuration_name = "PublicIPAddress"
  backend_address_pool_ids       = [azurerm_lb_backend_address_pool.web_backend_pool.id]
  probe_id                       = azurerm_lb_probe.tcp_probe.id
  enable_tcp_reset               = true
  idle_timeout_in_minutes        = 4
}

# Frontend probe to match actual port (5173)
resource "azurerm_lb_probe" "frontend_probe" {
  loadbalancer_id     = azurerm_lb.web_lb.id
  name                = "frontend-health-probe"
  protocol            = "Tcp"
  port                = 5173
  interval_in_seconds = 15
  number_of_probes    = 2
}