require 'active_support/core_ext'
require 'securerandom'

class EventsController < ApplicationController
#	before_action :authenticate_user!,
#		:only => [:new, :create]
	before_action :set_event, only: [:show, :edit, :update, :destroy]
	http_basic_authenticate_with name: "marketiers", password: "marketiersedit", only: [:edit, :update]

	# action to show all events
	def index
		@events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}.to_json
	end

	# action taken when a user wants to create a new event
	def new
	end

	def edit
	end

	# action taken when a user submits a new event
	def create
		identifier = "#{SecureRandom.random_number(36**5).to_s(36).rjust(5, "0")}-#{new_event[:name].split.join('-')}"
		@event = Event.new(event_params(identifier))
		@event.save
		redirect_to "/events/#{@event.identifier}"
	end

	def update
		@event.update(event_params(@event.identifier))
		redirect_to "/events/#{@event.identifier}"
	end

	# action to show one event by id
	def show
	end


private
	def event_params(identifier)
		age_ranges = []
		age_ranges << new_event[:age12_20] if new_event[:age12_20]
		age_ranges << new_event[:age21_35] if new_event[:age21_35]
		age_ranges << new_event[:age36_50] if new_event[:age36_50]
		age_ranges << new_event[:age51] if new_event[:age51]

		income_levels = []
		income_levels << new_event[:income_low] if new_event[:income_low]
		income_levels << new_event[:income_med] if new_event[:income_med]
		income_levels << new_event[:income_high] if new_event[:income_high]

		sponsorship_types = []
		sponsorship_types << new_event[:capital] if new_event[:capital]
		sponsorship_types << new_event[:merchandise] if new_event[:merchandise]
		sponsorship_types << new_event[:discounts] if new_event[:discounts]

		# new_event[:date] = mm/dd/yyyy
		ds = new_event[:date_starts].split("/")
		de = new_event[:date_ends].split("/")

		# new_event[:time] = hh:mm AM
		hour_plus_meridian = new_event[:time_starts].split
		hams = hour_plus_meridian[0].split(":")
		if (hour_plus_meridian[1] == "PM")
			hams[0] = hams[0].to_i + 12
		end
		hour_plus_meridian = new_event[:time_ends].split
		hame = hour_plus_meridian[0].split(":")
		if (hour_plus_meridian[1] == "PM")
			hame[0] = hame[0].to_i + 12
		end

		date_time_starts = Time.new(ds[2], ds[0], ds[1], hams[0], hams[1])
		date_time_ends = Time.new(de[2], de[0], de[1], hame[0], hame[1])

		if date_time_ends <= date_time_starts # if end date_time is before start date_time
			date_time_ends = date_time_starts + 2.hours
		end

		eparams = {
			identifier: identifier,
			first_name: new_event[:first_name],
			last_name: new_event[:last_name],
			contact_number: new_event[:phone],
			email: new_event[:email],
			name: new_event[:name],
			address1: new_event[:address1],
			address2: new_event[:address2],
			city: new_event[:city],
			region: new_event[:state_province_region],
			zipcode: new_event[:zipcode],
			country: new_event[:country],
			description: new_event[:description].gsub("\r\n", "<br />").gsub('"', '&quot;').gsub("'", "&#39;"),
			size_range: new_event[:size],
			sponsorship_requests: new_event[:sponsorship_requests].gsub("\r\n", "<br />").gsub('"', '&quot;').gsub("'", "&#39;"),
			recurrence: new_event[:recurrence],
			attendees_gender: new_event[:gender],
			image_url: new_event[:image_url],
			date_time_starts: date_time_starts,
			date_time_ends: date_time_ends,
			age_ranges: age_ranges,
			attendees_income_levels: income_levels,
			sponsorship_types: sponsorship_types,
			total_amount: new_event[:total_amount],
			min_amount: new_event[:min_amount]
		}

		return eparams
	end

	def new_event
		params.require(:event).permit(
			:first_name, :last_name, :email,
			:name, :size, :date_starts, :time_starts,
			:date_ends, :time_ends, :address1, 
			:address2, :city, :state_province_region, 
			:zipcode, :country, :phone, :description,
			:capital, :merchandise, :discounts,
			:total_amount, :min_amount,
			:sponsorship_requests, :recurrence,
			:age12_20, :age21_35, :age36_50, :age51,
			:gender, :income_low, :income_med, :income_high, :image_url)
	end

	def set_event
		@event = Event.find_by(identifier: params[:identifier]) # automatically escaped by RoR
	end
end