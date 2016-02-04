class CreateCollections < ActiveRecord::Migration
  def change
    create_table :collections do |t|
      t.string :title
      t.text :description
      t.jsonb :data

      t.timestamps null: false
    end
  end
end
