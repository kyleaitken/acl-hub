class CreateUserOutcomeMeasures < ActiveRecord::Migration[7.2]
  def change
    create_table :user_outcome_measures do |t|
      t.references :outcome_measure, null: false, foreign_key: { on_delete: :cascade }
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :target_value

      t.timestamps
    end
  end
end
