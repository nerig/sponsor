class TurnSposorshipTypeToAnArrayAtEvent < ActiveRecord::Migration
	def change
		remove_column :events, :sponsorship_type, :string
		add_column :events, :sponsorship_types, :text
	end
end
