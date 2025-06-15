class EnablePolymorphicResourceOwner < ActiveRecord::Migration[7.2]
  def change
    unless column_exists?(:oauth_access_tokens, :resource_owner_type)
      add_column :oauth_access_tokens, :resource_owner_type, :string
    end

    unless column_exists?(:oauth_access_grants, :resource_owner_type)
      add_column :oauth_access_grants, :resource_owner_type, :string
    end

    unless index_exists?(:oauth_access_tokens, [:resource_owner_type, :resource_owner_id])
      add_index :oauth_access_tokens, [:resource_owner_type, :resource_owner_id],
                name: 'index_oauth_access_tokens_on_polymorphic_owner'
    end

    unless index_exists?(:oauth_access_grants, [:resource_owner_type, :resource_owner_id])
      add_index :oauth_access_grants, [:resource_owner_type, :resource_owner_id],
                name: 'index_oauth_access_grants_on_polymorphic_owner'
    end
  end
end
