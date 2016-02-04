module Api
	class ItemResource < JSONAPI::Resource
	  attributes :title, :collection_id, :description, :url, :data, :image_source
	  has_one :collection
	end
end