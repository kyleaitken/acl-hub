class Warmup < ApplicationRecord
    validates :name, presence: true
    belongs_to :coach
    has_many :warmup_exercises, dependent: :destroy
    has_many :exercises, through: :warmup_exercises
end
