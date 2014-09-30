class AddFieldsToEvent < ActiveRecord::Migration
  def change
    
    remove_column :events, :date, :date
    remove_column :events, :time, :time
    remove_column :events, :size, :integer

    add_column :events, :size_range, :string
    add_column :events, :date, :string
    add_column :events, :time, :string
    add_column :events, :sponsorship_type, :string
    add_column :events, :sponsorship_requests, :text
    add_column :events, :recurrence, :string
    add_column :events, :age_range, :string
    add_column :events, :attendees_gender, :string
    add_column :events, :attendees_income_level, :string
  end
end
