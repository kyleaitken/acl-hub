class CreateProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    create_table :program_workouts do |t|
      t.references :program, null: false, foreign_key: true
      t.integer :day
      t.integer :week
      t.integer :order

      t.timestamps
    end
  end
end
