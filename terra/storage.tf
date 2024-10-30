/****************************************************
*                      STORAGE                      *
*****************************************************/
resource "azurerm_storage_account" "aclhub_storage" {
  name                     = "aclhubmainstorage"
  resource_group_name      = azurerm_resource_group.aclhub_rg.name
  location                 = azurerm_resource_group.aclhub_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "aclhub" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.aclhub_storage.name
}