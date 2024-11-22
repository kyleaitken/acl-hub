class AddNameAndWarmupToUserProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    add_column :user_program_workouts, :name, :string
    add_column :user_program_workouts, :warmup, :text
  end
end
