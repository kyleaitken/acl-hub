class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.references :coach, foreign_key: true, null: true
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.date :birth_date, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.boolean :active, default: true

      t.timestamps
    end
  end
end