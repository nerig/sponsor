class CreateSponsorshipResponses < ActiveRecord::Migration
  def change
    create_table :sponsorship_responses do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone_number
      t.string :company_name
      t.string :title
      t.text :offered_sponsorship
      t.text :comments

      t.references :event, index: true

      t.timestamps
    end
  end
end
