class UserOutcomeMeasure < ApplicationRecord
  belongs_to :outcome_measure
  belongs_to :user

  has_many :user_outcome_measure_recordings, dependent: :destroy
end