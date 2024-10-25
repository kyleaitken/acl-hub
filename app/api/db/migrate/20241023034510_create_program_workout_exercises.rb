class CreateProgramWorkoutExercises < ActiveRecord::Migration[7.2]
  def change
    create_table :program_workout_exercises do |t|
      t.references :program_workout, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.string :order
      t.string :instructions
      t.integer :sets
      t.integer :reps
      t.float :weight
      t.string :duration
      t.string :hold

      t.timestamps
    end
  end
end
