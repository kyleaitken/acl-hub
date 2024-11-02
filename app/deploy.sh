#!/bin/bash

# Log in to Azure Container Registry
az acr login --name aclhubcr

# Build/Tag/Push Frontend
docker build --no-cache -t frontend ./frontend
docker tag frontend aclhubcr.azurecr.io/frontend:latest
docker push aclhubcr.azurecr.io/frontend:latest

# Build/Tag/Push API
docker build --no-cache -t api ./api
docker tag api aclhubcr.azurecr.io/api:latest
docker push aclhubcr.azurecr.io/api:latest
