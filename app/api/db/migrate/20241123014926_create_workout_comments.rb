class CreateWorkoutComments < ActiveRecord::Migration[7.2]
  def change
    create_table :workout_comments do |t|
      t.references :user_program_workout, null: false, foreign_key: true
      t.text :content
      t.datetime :timestamp

      t.timestamps
    end
  end
end
