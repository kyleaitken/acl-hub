class CreateExerciseImages < ActiveRecord::Migration[7.2]
  def change
    create_table :exercise_images do |t|
      t.references :exercise, null: false, foreign_key: true
      t.integer :order
      t.string :url

      t.timestamps
    end
  end
end
