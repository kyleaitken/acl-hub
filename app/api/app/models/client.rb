class Client < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  belongs_to :coach
  has_many :client_outcome_measures, dependent: :destroy
  has_many :client_programs, dependent: :destroy

  # Ensure the email is unique and present
  validates :email, presence: true, uniqueness: true

  # Additional validation for email format (optional)
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Callback to downcase the email before saving the record
  before_save :downcase_email

  # Validate that coach_id must reference an existing coach
  validates :coach_id, presence: true
  validates :coach_id, numericality: { only_integer: true }
  validate :coach_exists

  private

  # Method to downcase the email
  def downcase_email
    self.email = email.downcase
  end

  def coach_exists
    if coach_id.present? && !Coach.exists?(coach_id)
      errors.add(:coach_id, 'must reference a valid coach')
    end
  end
  
end