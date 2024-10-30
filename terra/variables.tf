variable "rg_name" {
    type = string
    default = "aclhub-rg"
}

variable "default_location" {
    type    = string
    default = "Canada Central"
}

variable "container_registry_name" {
  type        = string
  description = "Name of the Azure Container Registry."
  default     = "aclhubcr"
}

variable "app_service_name" {
  type        = string
  description = "Name of the App Service for hosting the containers."
  default     = "aclhub-app-service"
}

variable "postgres_server_name" {
  type        = string
  description = "Name of the PostgreSQL server."
  default     = "aclhub-db"
}
