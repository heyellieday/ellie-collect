class AddUidToCollection < ActiveRecord::Migration
  def change
    add_column :collections, :uid, :string
    add_index :collections, :uid
  end
end
