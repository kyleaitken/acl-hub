class Tag < ApplicationRecord
  validates :name, presence: true
  belongs_to :coach
  has_and_belongs_to_many :programs
end
