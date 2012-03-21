class AddOtexId < ActiveRecord::Migration
  def self.up
    add_column    :segments, :otex_id, :integer
  end

  def self.down
    remove_column  :segments, :otex_id, :integer
  end
end
