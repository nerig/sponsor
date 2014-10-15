# == Schema Information
#
# Table name: events
#
#  id                     :integer          not null, primary key
#  name                   :string(255)
#  address1               :text
#  address2               :text
#  city                   :string(255)
#  region                 :string(255)
#  zip_code               :integer
#  country                :string(255)
#  contact_number         :string(255)
#  description            :text
#  user_id                :integer
#  created_at             :datetime
#  updated_at             :datetime
#  size_range             :string(255)
#  sponsorship_requests   :text
#  recurrence             :string(255)
#  age_range              :string(255)
#  attendees_gender       :string(255)
#  attendees_income_level :string(255)
#  image_url              :string(255)
#  date_time              :datetime
#  sponsorship_types      :text
#
# Indexes
#
#  index_events_on_user_id  (user_id)
#

class Event < ActiveRecord::Base
	belongs_to :user

	serialize :sponsorship_types, Array
end
