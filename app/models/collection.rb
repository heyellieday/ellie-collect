class Collection < ActiveRecord::Base
	before_save do
    self.slug = ('a'..'z').to_a.shuffle[0,8].join
  end
  validates_uniqueness_of :slug

  has_many :items
end
