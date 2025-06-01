class AddDescriptionToPrograms < ActiveRecord::Migration[7.2]
  def change
    add_column :programs, :description, :string
    add_column :user_programs, :description, :string
  end
end
