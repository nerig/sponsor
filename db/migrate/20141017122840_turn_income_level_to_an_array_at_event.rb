class TurnIncomeLevelToAnArrayAtEvent < ActiveRecord::Migration
	def change
		remove_column :events, :attendees_income_level, :string
		add_column :events, :attendees_income_levels, :text
	end
end
