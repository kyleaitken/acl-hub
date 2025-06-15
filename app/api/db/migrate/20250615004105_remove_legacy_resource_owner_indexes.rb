class RemoveLegacyResourceOwnerIndexes < ActiveRecord::Migration[7.0]
  def change
    remove_index :oauth_access_tokens, :resource_owner_id
    remove_index :oauth_access_grants, :resource_owner_id
  end
end