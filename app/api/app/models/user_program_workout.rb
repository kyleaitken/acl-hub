class UserProgramWorkout < ApplicationRecord
  belongs_to :user_program
  has_many :user_program_workout_exercises, dependent: :destroy

  before_validation :set_next_available_order, on: :create

  validates :date, :day, :week, presence: true
  validates :order, uniqueness: { scope: [:user_program_id, :date] }

  private

  def set_next_available_order
    return if order.present? 

    # Find the maximum `order` number for workouts on the same date in this user program
    max_order = UserProgramWorkout.where(user_program_id: user_program_id, date: date).maximum(:order) || 0

    # Set order to the next available number
    self.order = max_order + 1
  end

end
