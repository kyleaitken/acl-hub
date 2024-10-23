class AddUniqueIndexToExerciseImages < ActiveRecord::Migration[6.0]
  def change
    add_index :exercise_images, [:exercise_id, :order], unique: true
  end
end