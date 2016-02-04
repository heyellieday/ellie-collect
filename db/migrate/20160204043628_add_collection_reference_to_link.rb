class AddCollectionReferenceToLink < ActiveRecord::Migration
  def change
    add_reference :links, :collection, index: true, foreign_key: true
  end
end
