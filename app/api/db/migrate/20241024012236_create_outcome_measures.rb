class CreateOutcomeMeasures < ActiveRecord::Migration[7.2]
  def change
    create_table :outcome_measures do |t|
      t.string :name

      t.timestamps
    end
  end
end
