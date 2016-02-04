class AddSlugToCollection < ActiveRecord::Migration
  def change
    add_column :collections, :slug, :string, index: true
  end
end
