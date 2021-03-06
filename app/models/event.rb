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
#  sponsorship_types       :text
#  attendees_income_levels :text
#  age_ranges              :text
#  zipcode                 :string(255)
#  total_amount            :integer
#  min_amount              :integer
#  first_name              :string(255)
#  last_name               :string(255)
#  email                   :string(255)
#  date_time_starts        :datetime
#  date_time_ends          :datetime
#  identifier              :string(255)
#
# Indexes
#
#  index_events_on_identifier  (identifier) UNIQUE
#  index_events_on_user_id     (user_id)
#

class Event < ActiveRecord::Base
	belongs_to :user

	serialize :sponsorship_types, Array
	serialize :age_ranges, Array
	serialize :attendees_income_levels, Array

	after_initialize { |event|
		unless event.image_url.blank?
			# replacing the shortened image url with the full url which we couldn't save since it was too long
			# this is probably temporary and what we should really do is change the db schema so that image_url's
			# type is text instead of string
			event.image_url.sub!("~!shrtn!~", "https://img.evbuc.com/https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F")
		end
	}

end
