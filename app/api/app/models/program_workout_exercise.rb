class ProgramWorkoutExercise < ApplicationRecord
  belongs_to :program_workout, inverse_of: :program_workout_exercises
  belongs_to :exercise, inverse_of: :program_workout_exercises

  validates :order, presence: true

  accepts_nested_attributes_for :exercise,
    reject_if: ->(attrs) { attrs['id'].present? }
end
