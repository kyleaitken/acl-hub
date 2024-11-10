class AddStartDateAndEndDateToUserPrograms < ActiveRecord::Migration[7.2]
  def change
    add_column :user_programs, :start_date, :date
    add_column :user_programs, :end_date, :date
    add_column :user_programs, :num_weeks, :integer
    add_column :user_programs, :name, :string
  end
end
