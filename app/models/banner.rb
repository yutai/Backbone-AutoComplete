class Banner < ActiveRecord::Base
  has_many :segments
  has_many :variations
end
