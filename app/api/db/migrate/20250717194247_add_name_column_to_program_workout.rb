class AddNameColumnToProgramWorkout < ActiveRecord::Migration[7.2]
  def change
    add_column :program_workouts, :name, :string
  end
end
