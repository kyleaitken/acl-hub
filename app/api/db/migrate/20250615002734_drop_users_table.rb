class DropUsersTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :users do |t|
      t.references :coach, null: false, foreign_key: true
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.date :birth_date, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.boolean :active, default: true
      t.string :encrypted_password, null: false, default: ""
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.string :profile_picture_url

      t.timestamps
    end
  end
end
