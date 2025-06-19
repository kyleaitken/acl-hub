# app/models/workout_comment.rb
class WorkoutComment < ApplicationRecord
  belongs_to :client_program_workout

  validates :content, presence: true
  validates :timestamp, presence: true
  validates :user_type, presence: true

  after_commit :mark_workout_as_updated, on: [:create, :update]

  private

  def mark_workout_as_updated
    client_program_workout.update_column(:updated, true)
  end
end
