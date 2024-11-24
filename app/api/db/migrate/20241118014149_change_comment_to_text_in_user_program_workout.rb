class ChangeCommentToTextInUserProgramWorkout < ActiveRecord::Migration[7.2]
  def change
    change_column :user_program_workouts, :comment, :text
  end
end
