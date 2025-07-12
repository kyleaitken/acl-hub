class CreateCooldowns < ActiveRecord::Migration[7.2]
  def change
    create_table :cooldowns do |t|
      t.string :name
      t.text :instructions

      t.timestamps
    end
  end
end
