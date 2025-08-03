class ProgramWorkoutExerciseSerializer
  include JSONAPI::Serializer

  attributes :id, :order, :instructions, :created_at, :updated_at

  belongs_to :exercise, serializer: ExerciseSerializer
end
