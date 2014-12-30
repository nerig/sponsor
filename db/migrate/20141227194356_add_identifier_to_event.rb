class AddIdentifierToEvent < ActiveRecord::Migration
  def change
    add_column :events, :identifier, :string
    add_index :events, :identifier, unique: true
  end
end
