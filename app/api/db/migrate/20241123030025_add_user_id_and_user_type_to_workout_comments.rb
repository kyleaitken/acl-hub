class AddUserIdAndUserTypeToWorkoutComments < ActiveRecord::Migration[7.2]
  def change
    add_column :workout_comments, :user_type, :string
  end
end
