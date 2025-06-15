class RemoveUserForeignKeysFromOauth < ActiveRecord::Migration[7.2]
  def change
    remove_foreign_key :oauth_access_grants, column: :resource_owner_id
  end
end
