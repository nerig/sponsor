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
		@s3_direct_post = S3_BUCKET.presigned_post(key: "#{SecureRandom.uuid}--${filename}",
			success_action_status: 201, acl: :public_read)

		@aws_fields = @s3_direct_post.fields.to_json
		@aws_url = @s3_direct_post.url.to_s
		@aws_host = @s3_direct_post.url.host
	end

	def edit
	end

	# action taken when a user submits a new event
	def create
		identifier = "#{SecureRandom.random_number(36**5).to_s(36).rjust(5, "0")}-#{new_event[:name].parameterize}"
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
		# prepare similar events for bottom of the page
		# comparisonable event properties, by importance: gender (if not both), city+country, age, income
		
		events = Event.where("date_time_starts > ?", Time.now).to_a
		events.delete_if { |e| e.identifier == @event.identifier } # remove same event
		events_scores_and_similar_in_criteria = [] # array of event to a score resembling similarity and an array describe what is similar
		events.each { |e| 
			score_and_text = get_score_and_similar_in_criteria(e)
			next if score_and_text[0] == 0 # ignore non-similar events
			events_scores_and_similar_in_criteria << [e, score_and_text[0], score_and_text[1]] 
		}

		@three_similar_events = []
		events_scores_and_similar_in_criteria.sort_by { |event, score, crit| score }.reverse[0..2].each { |event, score, crit|
			event_details = {}
			event_details["name"] = event.name
			event_details["identifier"] = event.identifier
			event_details["image_url"] = event.image_url
			event_details["similar_in"] = crit

			@three_similar_events << event_details
		}

		@three_similar_events = @three_similar_events.to_json
	end

private
	def get_score_and_similar_in_criteria(event)
		# gender match (if not both) --> +6
		# city match --> +4
		# ages match (one is enough) --> +3
		# income levels match (one is enough) --> +1
		score = 0
		similar_in = []
		if @event.attendees_gender.downcase != "both"
			if @event.attendees_gender == event.attendees_gender
				score = score + 6
				similar_in << "gender"
			end
		end

		current_event_city_country = @event.city + @event.country
		event_city_country = event.city + event.country
		if current_event_city_country == event_city_country
			score = score + 4
			similar_in << "city"
		end

		event.age_ranges.each { |ar|
			if @event.age_ranges.include? ar
				score = score + 3
				similar_in << "ages"
				break
			end
		}

		event.attendees_income_levels.each { |inc|
			if @event.attendees_income_levels.include? inc
				score = score + 1
				similar_in << "income"
				break
			end
		}

		return score, similar_in
	end

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
			image_url: new_event[:image_url].downcase.start_with?("http") ? 
				new_event[:image_url] :
				"http://#{new_event[:image_url]}",
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