module Api
	class CollectionResource < JSONAPI::Resource
	  attributes :title, :description, :data
	  has_many :items
	end
end