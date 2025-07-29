class Cooldown < ApplicationRecord
    validates :name, presence: true, unless: :custom?
    belongs_to :coach

    has_many :cooldown_exercises, dependent: :destroy
    has_many :exercises, through: :cooldown_exercises
    has_many   :program_workouts,
        inverse_of: :cooldown,
        dependent: :nullify

    scope :custom, -> { where(custom: true) }
    scope :global, -> { where(custom: false) }
end
