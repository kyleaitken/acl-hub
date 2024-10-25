class ExerciseImage < ApplicationRecord
  belongs_to :exercise
  validates :order, presence: true, uniqueness: { scope: :exercise_id, message: "order must be unique per image" }
  validates :url, presence: true
end
