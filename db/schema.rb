# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120322210051) do

  create_table "banners", :force => true do |t|
    t.string   "name"
    t.string   "ad_type"
    t.string   "bid_type"
    t.float    "max_bid"
    t.float    "daily_budget"
    t.float    "total_budget"
    t.date     "start_date"
    t.date     "end_date"
    t.string   "name_space"
    t.boolean  "thirdparty"
    t.boolean  "rich_media"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "segments", :force => true do |t|
    t.string   "name"
    t.float    "price"
    t.integer  "banner_id"
    t.string   "bucket"
    t.integer  "source_segment_id"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "source_segments", :force => true do |t|
    t.string   "name"
    t.float    "price"
    t.string   "bucket"
    t.string   "provider"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "variations", :force => true do |t|
    t.integer  "banner_id"
    t.string   "headline"
    t.string   "adtext"
    t.string   "destination_url"
    t.string   "display_url"
    t.string   "img_src"
    t.string   "fpa_url"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

end
