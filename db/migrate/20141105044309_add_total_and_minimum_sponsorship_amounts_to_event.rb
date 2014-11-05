class AddTotalAndMinimumSponsorshipAmountsToEvent < ActiveRecord::Migration
  def change
    add_column :events, :total_amount, :integer
    add_column :events, :min_amount, :integer
  end
end
