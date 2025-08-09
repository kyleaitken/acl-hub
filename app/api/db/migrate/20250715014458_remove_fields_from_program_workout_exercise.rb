class RemoveFieldsFromProgramWorkoutExercise < ActiveRecord::Migration[7.2]
  def change
    remove_column :program_workout_exercises, :sets, :integer
    remove_column :program_workout_exercises, :reps, :integer
    remove_column :program_workout_exercises, :weight, :float
    remove_column :program_workout_exercises, :duration, :string
    remove_column :program_workout_exercises, :hold, :string
  end
end
