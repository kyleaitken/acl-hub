class User < ApplicationRecord
  belongs_to :coach, optional: true  
end
