class FixDateTimeToDateTimeRangeInEvent < ActiveRecord::Migration
	def change
		remove_column :events, :date_time, :datetime
		add_column :events, :date_time_starts, :datetime
		add_column :events, :date_time_ends, :datetime
	end
end
