class Coach < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
    has_many :clients, dependent: :nullify 
    has_many :programs, dependent: :destroy

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
