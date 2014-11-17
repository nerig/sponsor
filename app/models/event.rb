# == Schema Information
#
# Table name: events
#
#  id                      :integer          not null, primary key
#  name                    :string(255)
#  address1                :text
#  address2                :text
#  city                    :string(255)
#  region                  :string(255)
#  country                 :string(255)
#  contact_number          :string(255)
#  description             :text
#  user_id                 :integer
#  created_at              :datetime
#  updated_at              :datetime
#  size_range              :string(255)
#  sponsorship_requests    :text
#  recurrence              :string(255)
#  attendees_gender        :string(255)
#  image_url               :string(255)
#  date_time               :datetime
#  sponsorship_types       :text
#  attendees_income_levels :text
#  age_ranges              :text
#  zipcode                 :string(255)
#  total_amount            :integer
#  min_amount              :integer
#  first_name              :string(255)
#  last_name               :string(255)
#  email                   :string(255)
#
# Indexes
#
#  index_events_on_user_id  (user_id)
#

class Event < ActiveRecord::Base
	belongs_to :user

	serialize :sponsorship_types, Array
	serialize :age_ranges, Array
	serialize :attendees_income_levels, Array
end
