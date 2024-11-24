class UserProgramWorkout < ApplicationRecord
  belongs_to :user_program
  has_many :user_program_workout_exercises, dependent: :destroy
  has_many :workout_comments, dependent: :destroy

  before_validation :set_next_available_order, on: :create
  after_save :mark_updated_on_changes

  validates :date, :day, :week, presence: true
  validates :order, uniqueness: { scope: [:user_program_id, :date] }

  private

  def mark_updated_on_changes
    if saved_change_to_comment? || saved_change_to_completed?
      update_column(:updated, true) # Directly updates the database without running validations
    end
  end

  def set_next_available_order
    return if order.present? 

    # Find the maximum `order` number for workouts on the same date in this user program
    max_order = UserProgramWorkout.where(user_program_id: user_program_id, date: date).maximum(:order) || 0

    # Set order to the next available number
    self.order = max_order + 1
  end

end
