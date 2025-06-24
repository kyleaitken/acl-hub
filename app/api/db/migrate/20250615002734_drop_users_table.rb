class DropUsersTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :users, force: :cascade
  end
end