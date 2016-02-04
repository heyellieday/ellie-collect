class RenameImageUrlToImageSource < ActiveRecord::Migration
  def change
  	rename_column :items, :image_url, :image_source
  end
end
