class RemoveCommentFromUserProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    remove_column :user_program_workouts, :comment, :text
  end
end
