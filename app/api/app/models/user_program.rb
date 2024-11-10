class UserProgram < ApplicationRecord
  belongs_to :user
  has_many :user_program_workouts, dependent: :destroy

  validates :start_date, :end_date, :num_weeks, :name, presence: true
  validate :end_date_after_start_date

  private

  def end_date_after_start_date
    if end_date.present? && start_date.present? && end_date < start_date
      errors.add(:end_date, "must be after the start date")
    end
  end
end
