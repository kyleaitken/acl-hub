class WorkoutComment < ApplicationRecord
  belongs_to :user_program_workout
  validates :content, presence: true
  validates :timestamp, presence: true
  validates :user_type, presence: true
end
