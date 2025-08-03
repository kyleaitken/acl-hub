class ProgramWorkoutSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :week, :day, :order, :created_at, :updated_at

  belongs_to :warmup,
             serializer: WarmupSerializer,
             include_data: true   # ← inline warmup object
  belongs_to :cooldown,
             serializer: CooldownSerializer,
             include_data: true
  has_many   :program_workout_exercises,
             serializer: ProgramWorkoutExerciseSerializer,
             include_data: true
end