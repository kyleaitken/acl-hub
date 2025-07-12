class Cooldown < ApplicationRecord
    validates :name, presence: true
    belongs_to :coach
    has_many :cooldown_exercises, dependent: :destroy
    has_many :exercises, through: :cooldown_exercises
end
