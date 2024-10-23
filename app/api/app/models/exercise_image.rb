class ExerciseImage < ApplicationRecord
  belongs_to :exercise
  validates :url, presence: true
end
