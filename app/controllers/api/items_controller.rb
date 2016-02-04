class Api::ItemsController < Api::ApplicationController
	def new
		render json: JSONAPI::ResourceSerializer.new(
			Api::ItemResource
		).serialize_to_hash(
			Api::ItemResource.new(
				Item.new(
					collection_id: params[:collection_id]
				),
				nil
			)
		)
	end

end