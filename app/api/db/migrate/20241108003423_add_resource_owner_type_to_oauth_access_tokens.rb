class AddResourceOwnerTypeToOauthAccessTokens < ActiveRecord::Migration[7.2]
  def change
    add_column :oauth_access_tokens, :resource_owner_type, :string, default: 'User'
  end
end
