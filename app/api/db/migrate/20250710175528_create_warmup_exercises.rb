class CreateWarmupExercises < ActiveRecord::Migration[7.2]
  def change
    create_table :warmup_exercises do |t|
      t.references :warmup, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true

      t.timestamps
    end

    add_index :warmup_exercises, [:warmup_id, :exercise_id], unique: true
  end
end
