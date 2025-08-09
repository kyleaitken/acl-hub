class CreateWarmups < ActiveRecord::Migration[7.2]
  def change
    create_table :warmups do |t|
      t.string :name
      t.text :instructions

      t.timestamps
    end
  end
end
