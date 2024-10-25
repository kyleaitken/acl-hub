class Exercise < ApplicationRecord
    has_many :exercise_images, dependent: :destroy

    validates :name, presence: true
    validates :video_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
end
