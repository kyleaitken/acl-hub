class CreateUserOutcomeMeasureRecordings < ActiveRecord::Migration[7.2]
  def change
    create_table :user_outcome_measure_recordings do |t|
      t.references :user_outcome_measure, null: false, foreign_key: { on_delete: :cascade }
      t.string :value
      t.date :date

      t.timestamps
    end
  end
end
