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

  before_destroy :stash_old_routine_ids
  after_destroy_commit :cleanup_orphaned_routines

  private

  def stash_old_routine_ids
    @old_warmup_id   = warmup_id
    @old_cooldown_id = cooldown_id
  end

  def cleanup_orphaned_routines
    [ [@old_warmup_id, Warmup],
      [@old_cooldown_id, Cooldown]
    ].each do |old_id, klass|
      next unless old_id
      r = klass.find_by(id: old_id)
      if r&.custom? && r.program_workouts.empty?
        r.destroy
      end
    end
  end

end