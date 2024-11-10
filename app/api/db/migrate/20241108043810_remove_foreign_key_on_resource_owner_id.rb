class RemoveForeignKeyOnResourceOwnerId < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :oauth_access_tokens, column: :resource_owner_id
  end
end