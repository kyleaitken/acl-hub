class AddUpdatedToUserProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    add_column :user_program_workouts, :updated, :boolean, default: false, null: false
  end
end
