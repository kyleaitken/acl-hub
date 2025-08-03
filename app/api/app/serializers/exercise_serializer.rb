class ExerciseSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :video_url, :custom, :created_at, :updated_at
end
