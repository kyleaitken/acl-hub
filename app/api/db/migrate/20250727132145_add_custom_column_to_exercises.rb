class AddCustomColumnToExercises < ActiveRecord::Migration[7.2]
  def change
    add_column :exercises, :custom, :boolean, default: false, null: false
  end
end
