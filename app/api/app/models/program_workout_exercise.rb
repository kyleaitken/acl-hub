class ProgramWorkoutExercise < ApplicationRecord
  belongs_to :program_workout, inverse_of: :program_workout_exercises
  belongs_to :exercise,         inverse_of: :program_workout_exercises

  validates :order, presence: true
  accepts_nested_attributes_for :exercise, reject_if: ->(attrs){ attrs['id'].present? }

  before_update           :remember_old_exercise_id
  after_update_commit     :destroy_old_exercise_if_orphan
  after_destroy_commit    :destroy_orphaned_exercise

  private

  def remember_old_exercise_id
    @old_exercise_id = exercise_id_was
  end

  def destroy_old_exercise_if_orphan
    return unless @old_exercise_id && @old_exercise_id != exercise_id

    old = Exercise.find_by(id: @old_exercise_id)
    if old&.custom? && old.program_workout_exercises.reload.empty?
      old.destroy
    end
  end

  def destroy_orphaned_exercise
    ex = exercise
    if ex.custom? && ex.program_workout_exercises.reload.empty?
      ex.destroy
    end
  end
end