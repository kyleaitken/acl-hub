provider "azurerm" {
  features {}
  subscription_id = "ddc5c901-47ed-4442-8b5c-a147ea3fa030"
  tenant_id = "1db67df3-76c7-4ac0-b4d3-3cfe9983f2b5"
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0" 
    }
  }
  backend "azurerm" {
    resource_group_name   = "aclhub-rg"
    storage_account_name = "aclhubmainstorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }

}