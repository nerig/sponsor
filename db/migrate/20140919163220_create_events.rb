class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.integer :size
      t.text :address1
      t.text :address2
      t.string :city
      t.string :region
      t.integer :zip_code
      t.string :country
      t.date :date
      t.time :time
      t.string :contact_number
      t.text :description

      t.timestamps
    end
  end
end
