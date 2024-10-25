class ProgramWorkoutExercise < ApplicationRecord
  belongs_to :program_workout
  belongs_to :exercise

  validates :order, presence: true
  validates :instructions, presence: true
  validates :sets, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :reps, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :weight, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :duration, numericality: { only_integer: true }, allow_nil: true
end
