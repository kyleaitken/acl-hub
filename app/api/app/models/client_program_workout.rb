class ClientProgramWorkout < ApplicationRecord
  belongs_to :client_program
  has_many :client_program_workout_exercises, dependent: :destroy
  has_many :workout_comments, dependent: :destroy

  before_validation :set_next_available_order, on: :create

  validates :date, :day, :week, presence: true
  validates :order, uniqueness: { scope: [:client_program_id, :date] }

  private

  def set_next_available_order
    return if order.present? 

    # Find the maximum `order` number for workouts on the same date in this client program
    max_order = ClientProgramWorkout.where(client_program_id: client_program_id, date: date).maximum(:order) || 0

    # Set order to the next available number
    self.order = max_order + 1
  end

end
