class FixClientsTableDefaultsAndIndexes < ActiveRecord::Migration[7.2]
  def change
    change_column_default :clients, :active, from: nil, to: true
    change_column_null :clients, :active, false

    change_column_default :clients, :encrypted_password, from: nil, to: ""
    change_column_null :clients, :encrypted_password, false

    change_column_null :clients, :first_name, false
    change_column_null :clients, :last_name, false
    change_column_null :clients, :birth_date, false
    change_column_null :clients, :email, false
    change_column_null :clients, :phone, false

    add_index :clients, :email, unique: true
    add_index :clients, :reset_password_token, unique: true
  end
end