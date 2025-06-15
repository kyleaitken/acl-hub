class ChangeDefaultResourceOwnerTypeToClient < ActiveRecord::Migration[7.0]
  def change
    change_column_default :oauth_access_tokens, :resource_owner_type, from: "User", to: "Client"
  end
end