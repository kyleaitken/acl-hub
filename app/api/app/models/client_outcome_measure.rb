class ClientOutcomeMeasure < ApplicationRecord
  belongs_to :outcome_measure
  belongs_to :client

  has_many :client_outcome_measure_recordings, dependent: :destroy
end