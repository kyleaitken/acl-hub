class UserProgramWorkoutExercise < ApplicationRecord
  belongs_to :user_program_workout
  belongs_to :exercise

  before_validation :set_next_available_order, on: :create

  validates :user_program_workout_id, :exercise_id, presence: true

  private

  def set_next_available_order
    return if order.present?
  
    # Find the maximum `order` for exercises within the same workout
    max_order = UserProgramWorkoutExercise.where(user_program_workout_id: user_program_workout_id)
                                          .maximum(:order)&.to_i
  
    # Set order to "1" if max_order is nil; otherwise, increment by 1
    self.order = (max_order ? max_order + 1 : 1).to_s
  end
end
