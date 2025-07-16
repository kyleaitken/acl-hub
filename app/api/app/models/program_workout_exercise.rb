class ProgramWorkoutExercise < ApplicationRecord
  belongs_to :program_workout
  belongs_to :exercise

  validates :order, presence: true
  validates :instructions, presence: true
end
