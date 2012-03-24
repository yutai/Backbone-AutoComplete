class CreateSourceSegments < ActiveRecord::Migration
  def change
    create_table :source_segments do |t|
      t.string :name
      t.float :price
      t.string :bucket
      t.string :provider

      t.timestamps
    end
  end
end
