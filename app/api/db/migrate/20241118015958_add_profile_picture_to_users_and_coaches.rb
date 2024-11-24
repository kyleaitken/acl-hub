class AddProfilePictureToUsersAndCoaches < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :profile_picture_url, :string
    add_column :coaches, :profile_picture_url, :string
  end
end
