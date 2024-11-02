require 'azure_mgmt_key_vault'
require 'azure_mgmt_authorization'

if Rails.env.development? || Rails.env.test?
    ENV['RAILS_MASTER_KEY'] ||= `echo $RAILS_MASTER_KEY`.strip
elsif Rails.env.production?
    # Configure the Azure Key Vault client
    key_vault_name = "aclhubkeyvault"
    key_vault_url = "https://aclhubkeyvault.vault.azure.net/"

    credentials = Azure::Mgmt::Authorization::AzureCliCredentials.new
    key_vault_client = Azure::KeyVault::KeyVaultClient.new(credentials)

    # Retrieve the RAILS_MASTER_KEY from Key Vault
    begin
        secret = client.get_secret(key_vault_url, "rails-master-key")
        ENV['RAILS_MASTER_KEY'] = secret.value
    rescue => e
        Rails.logger.error("Failed to retrieve the RAILS_MASTER_KEY: #{e.message}")
        raise "Missing RAILS_MASTER_KEY" if ENV['RAILS_MASTER_KEY'].nil?
    end
end