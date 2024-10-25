class ProgramWorkout < ApplicationRecord
  belongs_to :program
  has_many :program_workout_exercises, dependent: :destroy

  validates :day, presence: true
  validates :week, presence: true
  validates :order, presence: true
end
