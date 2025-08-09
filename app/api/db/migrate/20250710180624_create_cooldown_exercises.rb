class CreateCooldownExercises < ActiveRecord::Migration[7.2]
  def change
    create_table :cooldown_exercises do |t|
      t.references :cooldown, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true

      t.timestamps
    end
    add_index :cooldown_exercises, [:cooldown_id, :exercise_id], unique: true
  end
end
