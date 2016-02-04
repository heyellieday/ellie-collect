class RenameLinkToItem < ActiveRecord::Migration
    def change
    rename_table :links, :items
  end
end
