class AddCoachToWarmup < ActiveRecord::Migration[7.2]
  def change
    add_reference :warmups, :coach, null: false, foreign_key: true
  end
end
