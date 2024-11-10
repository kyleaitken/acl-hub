class MakeCoachIdRequiredForUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_null :users, :coach_id, false  
  end
end