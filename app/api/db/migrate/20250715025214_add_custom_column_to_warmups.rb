class AddCustomColumnToWarmups < ActiveRecord::Migration[7.2]
  def change
    add_column :warmups, :custom, :boolean, default: false, null: false
  end
end
