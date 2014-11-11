class AddAmountToSponsorshipResponse < ActiveRecord::Migration
  def change
    add_column :sponsorship_responses, :amount, :float
  end
end
