class Warmup < ApplicationRecord
    validates :name, presence: true
    belongs_to :coach

    has_many :warmup_exercises, dependent: :destroy
    has_many :exercises, through: :warmup_exercises

    scope :custom, -> { where(custom: true) }
    scope :global, -> { where(custom: false) }
end
