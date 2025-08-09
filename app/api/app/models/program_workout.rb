class ProgramWorkout < ApplicationRecord
  belongs_to :program

  has_many :program_workout_exercises,
           inverse_of: :program_workout,
           dependent: :destroy
  accepts_nested_attributes_for :program_workout_exercises, allow_destroy: true

  belongs_to :warmup,    optional: true, inverse_of: :program_workouts
  belongs_to :cooldown,  optional: true, inverse_of: :program_workouts
  accepts_nested_attributes_for :warmup,    reject_if: ->(attrs){ attrs['id'].present? }
  accepts_nested_attributes_for :cooldown,  reject_if: ->(attrs){ attrs['id'].present? }

  validates :day, :week, :order, presence: true

  after_destroy_commit :cleanup_orphaned_routines

  private

  def cleanup_orphaned_routines
    # if we dropped a warmup, delete it when orphaned
    if (old = Warmup.find_by(id: previous_changes["warmup_id"]&.first))&.custom? &&
       old.program_workouts.reload.empty?
      old.destroy
    end

    # same for cooldown
    if (old = Cooldown.find_by(id: previous_changes["cooldown_id"]&.first))&.custom? &&
       old.program_workouts.reload.empty?
      old.destroy
    end
  end

end