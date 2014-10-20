class EventsController < ApplicationController
#	before_action :authenticate_user!,
#		:only => [:new, :create]

	# action to show all events
	def index
		@events = Event.all.sort { |a, b| a.date_time <=> b.date_time}.to_json
	end

	# action taken when a user wants to create a new event
	def new
	end

	# action taken when a user submits a new event
	def create
		
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

		event_params = {
			name: new_event[:name],
			address1: new_event[:address1],
			address2: new_event[:address2],
			city: new_event[:city],
			region: new_event[:state_province_region],
			zip_code: new_event[:zipcode],
			country: new_event[:country],
			description: new_event[:description],
			size_range: new_event[:size],
			sponsorship_requests: new_event[:sponsorship_requests],
			recurrence: new_event[:recurrence],
			attendees_gender: new_event[:gender],
			image_url: "https://s3.amazonaws.com/rmktimages/logo4.jpg",
			date_time: Time.new(new_event[:year], new_event[:month], 
				new_event[:day], new_event[:hour], new_event[:minutes]), # add timezone
			age_ranges: age_ranges,
			attendees_income_levels: income_levels,
			sponsorship_types: sponsorship_types
		}

		@event = Event.new(event_params)
 
		@event.save
		redirect_to @event
	end

	# action to show one event by id
	def show
		@event = Event.find(params[:id])
	end


private
	def new_event
		params.require(:event).permit(
			:first_name, 
			:last_name,
			:email,
			:name,
			:size,
			:address1,
			:address2,
			:city,
			:state_province_region,
			:zipcode,
			:country,
			:month,
			:day,
			:year,
			:hour,
			:minutes,
			:ampm,
			:phone1,
			:phone2,
			:phone3,
			:description,
			:logo,
			:capital,
			:merchandise,
			:discounts,
			:sponsorship_requests,
			:recurrence,
			:age12_20,
			:age21_35,
			:age36_50,
			:age51,
			:gender,
			:income_low,
			:income_med,
			:income_high
			)
	end
end