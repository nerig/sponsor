class MakeAgeRangeAnArrayAtEvent < ActiveRecord::Migration
	def change
		remove_column :events, :age_range, :string
		add_column :events, :age_ranges, :text
	end
end
