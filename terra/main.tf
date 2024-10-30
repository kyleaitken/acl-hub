/****************************************************
*                       RG                          *
*****************************************************/
resource "azurerm_resource_group" "aclhub_rg" {
  name     = "${var.rg_name}"
  location = var.default_location
}

# Container Registry (if not created on the portal)
resource "azurerm_container_registry" "aclhub" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.aclhub_rg.name
  location            = azurerm_resource_group.aclhub_rg.location
  sku                 = "Basic"
  admin_enabled       = true
}


# Service Plan (for both API and Frontend)
resource "azurerm_service_plan" "app_service_plan" {
  name                = "aclhub-service-plan"
  location            = azurerm_resource_group.aclhub_rg.location
  resource_group_name = azurerm_resource_group.aclhub_rg.name
  sku_name            = "S1"
  os_type             = "Linux"
}


# API Web App (connects to backend container in ACR)
resource "azurerm_linux_web_app" "api_app" {
  name                = "aclhub-api"
  location            = azurerm_resource_group.aclhub_rg.location
  resource_group_name = azurerm_resource_group.aclhub_rg.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  site_config {
    application_stack {
      docker_image_name             = "api:latest"
      docker_registry_url           = "https://aclhubcr.azurecr.io"
    }
    container_registry_use_managed_identity = true  # Uses Managed Identity for ACR access

    cors {
      allowed_origins = [
        "http://aclhub-frontend.azurewebsites.net"
      ]
      support_credentials = true  # Enable Access-Control-Allow-Credentials
    }
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"    # Container should manage storage
    WEBSITES_PORT = "3000"                             # Set the custom port
    DATABASE_URL = "postgres://aclhub:${data.azurerm_key_vault_secret.postgres_password.value}@aclhub-flex-server.postgres.database.azure.com:5432/aclhub-db?sslmode=require"
  }

  identity {
    type = "SystemAssigned"  # Enables Managed Identity for the Web App to access ACR
  }

  logs {
    detailed_error_messages = true
    failed_request_tracing  = false
    http_logs {
        file_system {
            retention_in_days = 30
            retention_in_mb   = 35
          }
      }
  }
}


# Frontend Web App (connects to frontend container in ACR)
resource "azurerm_linux_web_app" "frontend_app" {
  name                = "aclhub-frontend"
  location            = azurerm_resource_group.aclhub_rg.location
  resource_group_name = azurerm_resource_group.aclhub_rg.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id
  
  # Any environment variables specific to frontend
  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    API_URL                             = "aclhub-api.azurewebsites.net"
  }

  identity {
    type = "SystemAssigned"  # Enables Managed Identity for the Web App to access ACR
  }

  site_config { 
    application_stack {
      docker_image_name             = "frontend:latest"
      docker_registry_url           = "https://aclhubcr.azurecr.io"
    }
    container_registry_use_managed_identity = true  # Uses Managed Identity for ACR access
  }
}


# Create a PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "aclhub_pgsql_server" {
  name                           = "aclhub-flex-server"
  resource_group_name            = azurerm_resource_group.aclhub_rg.name
  location                       = azurerm_resource_group.aclhub_rg.location
  version                        = "16"  # Use your desired PostgreSQL version
  administrator_login            = "aclhub"  # Admin username
  administrator_password         = data.azurerm_key_vault_secret.postgres_password.value

  sku_name                       = "GP_Standard_D4s_v3"

  storage_mb                     = 32768  
  public_network_access_enabled   = true  # Enable public access to the server

  zone                           = "3" 
}

resource "azurerm_postgresql_flexible_server_database" "example" {
  name      = "aclhub-db"
  server_id = azurerm_postgresql_flexible_server.aclhub_pgsql_server.id
  collation = "en_US.utf8"
  charset   = "utf8"

  # prevent the possibility of accidental data loss
  lifecycle {
    prevent_destroy = true
  }
}





/****************************************************
*                     KEYVAULT                      *
*****************************************************/
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "main" {
  name                        = "aclhubkeyvault"
  location                    = azurerm_resource_group.aclhub_rg.location
  resource_group_name         = azurerm_resource_group.aclhub_rg.name
  enabled_for_disk_encryption = true
  purge_protection_enabled    = false
  sku_name = "standard"
  tenant_id                   = data.azurerm_client_config.current.tenant_id

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get", "Set", "List"
    ]

    storage_permissions = [
      "Get",
    ]

    certificate_permissions = [
      "Create",
      "Delete",
      "Get",
      "Import",
      "List",
      "Update",
    ]
  }

}

resource "azurerm_key_vault_access_policy" "webapp_access_policy" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.api_app.identity[0].principal_id

  secret_permissions = ["Get"]
}

# Data source to retrieve the Key Vault secret
data "azurerm_key_vault_secret" "postgres_password" {
  name         = "postgres-password"             # Name of the secret in Key Vault
  key_vault_id = azurerm_key_vault.main.id       # ID of the Key Vault
}


resource "azurerm_role_assignment" "acr_pull_api" {
  principal_id   = azurerm_linux_web_app.api_app.identity[0].principal_id
  scope          = azurerm_container_registry.aclhub.id
  role_definition_name = "AcrPull"
}

resource "azurerm_role_assignment" "acr_pull_frontend" {
  principal_id   = azurerm_linux_web_app.frontend_app.identity[0].principal_id
  scope          = azurerm_container_registry.aclhub.id
  role_definition_name = "AcrPull"
}