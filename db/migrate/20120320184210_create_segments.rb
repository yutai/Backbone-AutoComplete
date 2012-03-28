class CreateSegments < ActiveRecord::Migration
  def change
    create_table :segments do |t|
      t.string :name
      t.float :price
      t.integer :banner_id
      t.string :bucket
      t.integer :source_segment_id
      t.timestamps
    end
  end
end
