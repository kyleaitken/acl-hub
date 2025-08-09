class ProgramWorkout < ApplicationRecord
  belongs_to :program

  has_many :program_workout_exercises,
            inverse_of: :program_workout,
            dependent: :destroy
  accepts_nested_attributes_for :program_workout_exercises,
    allow_destroy: true

  belongs_to :warmup, optional: true, inverse_of: :program_workouts
  belongs_to :cooldown, optional: true, inverse_of: :program_workouts

  accepts_nested_attributes_for :warmup,
    reject_if: ->(attrs) { attrs['id'].present? }
  accepts_nested_attributes_for :cooldown,
    reject_if: ->(attrs) { attrs['id'].present? }

  validates :day, presence: true
  validates :week, presence: true
  validates :order, presence: true
end
