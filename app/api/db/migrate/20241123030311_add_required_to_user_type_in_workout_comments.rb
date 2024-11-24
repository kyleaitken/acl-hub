class AddRequiredToUserTypeInWorkoutComments < ActiveRecord::Migration[7.2]
  def change
    change_column :workout_comments, :user_type, :string, null: false
  end
end
