class CreateExercises < ActiveRecord::Migration[7.2]
  def change
    create_table :exercises do |t|
      t.string :name
      t.string :description
      t.string :category
      t.string :muscle_group
      t.string :video_url

      t.timestamps
    end
  end
end
