class Api::CollectionsController < Api::ApplicationController
	def new
		render json: JSONAPI::ResourceSerializer.new(
			Api::CollectionResource
		).serialize_to_hash(
			Api::CollectionResource.new(
				Collection.new(
				),
				nil
			)
		)
	end

	def show
		collection = Collection.find(params[:id])

		items = {}
		collection.items.each do |item|
			items[item.id] = {
				id: item.id,
				attributes: item.attributes
			}
		end
		render json: {
			data: {
				attributes: collection.attributes,
				id: collection.id,
				items: items,
			}
		}
	end
end