# == Schema Information
#
# Table name: events
#
#  id             :integer          not null, primary key
#  name           :string(255)
#  size           :integer
#  address1       :text
#  address2       :text
#  city           :string(255)
#  region         :string(255)
#  zip_code       :integer
#  country        :string(255)
#  date           :date
#  time           :time
#  contact_number :string(255)
#  description    :text
#  created_at     :datetime
#  updated_at     :datetime
#

class Event < ActiveRecord::Base
end
