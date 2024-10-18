class Coach < ApplicationRecord
    has_many :users, dependent: :nullify 
end
