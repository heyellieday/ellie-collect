class AddUidToItem < ActiveRecord::Migration
  def change
    add_column :items, :uid, :string
    add_index :items, :uid
  end
end
