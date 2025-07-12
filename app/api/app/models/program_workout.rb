class ProgramWorkout < ApplicationRecord
  belongs_to :program
  has_many :program_workout_exercises, dependent: :destroy

  belongs_to :warmup, optional: true
  belongs_to :cooldown, optional: true

  validates :day, presence: true
  validates :week, presence: true
  validates :order, presence: true
end
