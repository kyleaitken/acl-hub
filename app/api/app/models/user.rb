class User < ApplicationRecord
  belongs_to :coach, optional: true 
  has_many :user_outcome_measures, dependent: :destroy

  # Ensure the email is unique and present
  validates :email, presence: true, uniqueness: true

  # Additional validation for email format (optional)
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Callback to downcase the email before saving the record
  before_save :downcase_email

  private

  # Method to downcase the email
  def downcase_email
    self.email = email.downcase
  end
end