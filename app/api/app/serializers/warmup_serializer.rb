class WarmupSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :instructions, :custom, :created_at, :updated_at

  has_many :exercises, serializer: ExerciseSerializer
end
