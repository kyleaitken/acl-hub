class CreateJoinTableProgramsTags < ActiveRecord::Migration[7.2]
  def change
    create_join_table :programs, :tags do |t|
      t.index [:program_id, :tag_id], unique: true
      t.foreign_key :programs
      t.foreign_key :tags
    end
  end
end