class CreateBanners < ActiveRecord::Migration
  def change
    create_table :banners do |t|
      t.string :name
      t.string :ad_type
      t.string :bid_type
      t.float :max_bid
      t.float :daily_budget
      t.float :total_budget
      t.date :start_date
      t.date :end_date
      t.string :name_space
      t.boolean :thirdparty
      t.boolean :rich_media

      t.timestamps
    end
  end
end
