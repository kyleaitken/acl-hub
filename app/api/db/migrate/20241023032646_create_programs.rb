class CreatePrograms < ActiveRecord::Migration[7.2]
  def change
    create_table :programs do |t|
      t.references :coach, null: false, foreign_key: true
      t.integer :num_weeks
      t.string :name

      t.timestamps
    end
  end
end
