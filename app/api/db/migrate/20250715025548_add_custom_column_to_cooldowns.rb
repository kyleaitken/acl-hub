class AddCustomColumnToCooldowns < ActiveRecord::Migration[7.2]
  def change
    add_column :cooldowns, :custom, :boolean, default: false, null: false
  end
end
