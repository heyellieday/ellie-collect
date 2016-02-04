class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.text :url
      t.string :title
      t.text :description
      t.jsonb :data
      t.text :image_url

      t.timestamps null: false
    end
  end
end
