class Warmup < ApplicationRecord
    validates :name, presence: true, unless: :custom?
    belongs_to :coach

    has_many :warmup_exercises, dependent: :destroy
    has_many :exercises, through: :warmup_exercises
    has_many   :program_workouts,
        inverse_of: :warmup,
        dependent: :nullify

    scope :custom, -> { where(custom: true) }
    scope :global, -> { where(custom: false) }
end
