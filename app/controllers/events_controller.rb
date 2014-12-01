class EventsController < ApplicationController
#	before_action :authenticate_user!,
#		:only => [:new, :create]
	before_action :set_event, only: [:show, :edit, :update, :destroy]
	http_basic_authenticate_with name: "marketiers", password: "marketiersedit", only: [:edit, :update]

	# action to show all events
	def index
		@events = Event.all.sort { |a, b| a.date_time <=> b.date_time}

		@events.each { |e|
			e.description.gsub!('"', '\"')
		}
		@events = @events.to_json.gsub("'", "\'")
	end

	# action taken when a user wants to create a new event
	def new
	end

	def edit
	end

	# action taken when a user submits a new event
	def create
		@event = Event.new(event_params)
		@event.save
		redirect_to @event
	end

	def update
		@event.update(event_params)
		redirect_to @event
	end

	# action to show one event by id
	def show
	end


private
	def event_params
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

		# new_event[:date] = mmm dd, yyyy
		da = new_event[:date].delete("\n,").split

		# new_event[:time] = hh:mm AM
		hour_plus_meridian = new_event[:time].split
		ham = hour_plus_meridian[0].split(":")
		if (hour_plus_meridian[1] == "PM")
			ham[0] = ham[0].to_i + 12
		end

		date_time = Time.new(da[2], da[0], da[1], ham[0], ham[1])

		time_array = new_event[:time]
		eparams = {
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
			description: new_event[:description],
			size_range: new_event[:size],
			sponsorship_requests: new_event[:sponsorship_requests],
			recurrence: new_event[:recurrence],
			attendees_gender: new_event[:gender],
			image_url: new_event[:image_url],
			date_time: date_time,
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
			:name, :size, :date, :time,
			:address1, :address2, :city,
			:state_province_region, :zipcode,
			:country, :phone, :description,
			:capital, :merchandise, :discounts,
			:total_amount, :min_amount,
			:sponsorship_requests, :recurrence,
			:age12_20, :age21_35, :age36_50, :age51,
			:gender, :income_low, :income_med, :income_high, :image_url)
	end

	def set_event
		@event = Event.find(params[:id])
	end
end