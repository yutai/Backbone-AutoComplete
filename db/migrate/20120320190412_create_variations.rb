class CreateVariations < ActiveRecord::Migration
  def change
    create_table :variations do |t|
      t.integer :banner_id
      t.string :headline
      t.string :adtext
      t.string :destination_url
      t.string :display_url
      t.string :site_name
      t.string :img_src
      t.string :fpa_url

      t.timestamps
    end
  end
end
