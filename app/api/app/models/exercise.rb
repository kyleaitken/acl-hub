class Exercise < ApplicationRecord
    has_many :exercise_images, dependent: :destroy
    has_many :client_program_workout_exercises, dependent: :destroy
    has_many :program_workout_exercises, dependent: :destroy

    validates :name, presence: true
    validates :video_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
end
