class Program < ApplicationRecord
  belongs_to :coach
  has_many :program_workouts, dependent: :destroy
  has_and_belongs_to_many :tags

  validates :name, presence: true
  validates :num_weeks, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
end