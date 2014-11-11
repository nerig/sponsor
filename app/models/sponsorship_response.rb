# == Schema Information
#
# Table name: sponsorship_responses
#
#  id                  :integer          not null, primary key
#  first_name          :string(255)
#  last_name           :string(255)
#  email               :string(255)
#  phone_number        :string(255)
#  company_name        :string(255)
#  title               :string(255)
#  offered_sponsorship :text
#  comments            :text
#  event_id            :integer
#  created_at          :datetime
#  updated_at          :datetime
#  amount              :float
#
# Indexes
#
#  index_sponsorship_responses_on_event_id  (event_id)
#

class SponsorshipResponse < ActiveRecord::Base
end
