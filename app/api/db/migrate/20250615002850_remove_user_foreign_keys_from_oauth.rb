class RemoveUserForeignKeysFromOauth < ActiveRecord::Migration[7.0]
  def change
    if foreign_key_exists?(:oauth_access_grants, column: :resource_owner_id)
      remove_foreign_key :oauth_access_grants, column: :resource_owner_id
    end

    if foreign_key_exists?(:oauth_access_tokens, column: :resource_owner_id)
      remove_foreign_key :oauth_access_tokens, column: :resource_owner_id
    end
  end
end