class CollectionsController < ApplicationController
  def show
  	@collection = Collection.find_by(slug: params[:id])
  end

  def create

  end

end
