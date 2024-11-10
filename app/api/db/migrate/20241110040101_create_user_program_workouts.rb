class CreateUserProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    create_table :user_program_workouts do |t|
      t.references :user_program, null: false, foreign_key: true
      t.date :date
      t.integer :day
      t.integer :week
      t.string :comment
      t.boolean :completed, default: false
      t.integer :order

      t.timestamps
    end

    add_index :user_program_workouts, [:user_program_id, :date, :order], unique: true
  end
end
