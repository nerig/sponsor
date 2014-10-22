class ChangeZipcodeToStringAtEvent < ActiveRecord::Migration
	def change
		remove_column :events, :zip_code, :integer
		add_column :events, :zipcode, :string
	end
end
