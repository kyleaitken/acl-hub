class ProgramWorkoutExercise < ApplicationRecord
  belongs_to :program_workout, inverse_of: :program_workout_exercises
  belongs_to :exercise,         inverse_of: :program_workout_exercises

  validates :order, presence: true

  accepts_nested_attributes_for :exercise,
    reject_if: ->(attrs) { attrs['id'].present? }

  # run on deletes
  after_destroy :destroy_orphan_exercise

  # run on updates that change which exercise we're pointing at
  before_update :remember_old_exercise_id
  after_update  :destroy_old_exercise_if_orphan

  private

  # stash the old foreign key before it’s overwritten
  def remember_old_exercise_id
    @old_exercise_id = exercise_id_was
  end

  # if we just changed to a new exercise, and the old one
  # was custom and now has no more joins, delete it
  def destroy_old_exercise_if_orphan
    return unless @old_exercise_id && @old_exercise_id != exercise_id

    old = Exercise.find_by(id: @old_exercise_id)
    if old&.custom? && old.program_workout_exercises.count.zero?
      old.destroy
    end
  end

  # when the join itself is deleted
  def destroy_orphan_exercise
    if exercise.custom? && exercise.program_workout_exercises.empty?
      exercise.destroy
    end
  end
end
