class CombineDateTimeToOneColumnAtEvent < ActiveRecord::Migration
  def change
  	add_column :events, :date_time, :datetime

  	remove_column :events, :date, :string
  	remove_column :events, :time, :string
  end
end
