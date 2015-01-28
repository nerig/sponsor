require 'active_support/core_ext'
require 'securerandom'

class EventsController < ApplicationController
#	before_action :authenticate_user!,
#		:only => [:new, :create]
	before_action :set_event, only: [:show, :edit, :update, :destroy]
	before_action :prepare_aws_vars, only: [:new, :edit]
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
		identifier = "#{SecureRandom.random_number(36**5).to_s(36).rjust(5, "0")}-#{crude_params[:name].parameterize}"
		@event = Event.new(event_params(identifier))
		@event.save

		notify_event("added")

		redirect_to "/events/#{@event.identifier}"
	end

	def update
		@event.update(event_params(@event.identifier))

		notify_event("updated")

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

	def notify_event(added_or_updated)
		subject = "A new event was added!"
		name = "Marketiers new event"
		email = "mrktiers@gmail.com"
		message = "Take a look - an event was #{added_or_updated} at www.mrktiers.com/events/#{@event.identifier}"

		mail = Mail.deliver do
		  to      'tempaner@gmail.com'
		  from    "#{name} <#{email}>"
		  subject subject

		  text_part do
		    body message
		  end
		end
	end

	def get_score_and_similar_in_criteria(event)
		# gender match (if not both) --> +4
		# city match --> +4
		# ages match (one is enough) --> +3
		# income levels match (one is enough) --> +1
		score = 0
		similar_in = []
		if @event.attendees_gender.downcase != "both"
			if @event.attendees_gender == event.attendees_gender
				score = score + 4
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
		age_ranges << crude_params[:age12_20] if crude_params[:age12_20]
		age_ranges << crude_params[:age21_35] if crude_params[:age21_35]
		age_ranges << crude_params[:age36_50] if crude_params[:age36_50]
		age_ranges << crude_params[:age51] if crude_params[:age51]

		income_levels = []
		income_levels << crude_params[:income_low] if crude_params[:income_low]
		income_levels << crude_params[:income_med] if crude_params[:income_med]
		income_levels << crude_params[:income_high] if crude_params[:income_high]

		sponsorship_types = []
		sponsorship_types << crude_params[:capital] if crude_params[:capital]
		sponsorship_types << crude_params[:merchandise] if crude_params[:merchandise]
		sponsorship_types << crude_params[:discounts] if crude_params[:discounts]

		# crude_params[:date] = mm/dd/yyyy
		ds = crude_params[:date_starts].split("/")
		de = crude_params[:date_ends].split("/")

		# crude_params[:time] = hh:mm AM
		hour_plus_meridian = crude_params[:time_starts].split
		hams = hour_plus_meridian[0].split(":")
		if (hour_plus_meridian[1] == "PM")
			hams[0] = hams[0].to_i + 12
		end
		hour_plus_meridian = crude_params[:time_ends].split
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
			first_name: crude_params[:first_name],
			last_name: crude_params[:last_name],
			contact_number: crude_params[:phone],
			email: crude_params[:email],
			name: crude_params[:name],
			address1: crude_params[:address1],
			address2: crude_params[:address2],
			city: crude_params[:city],
			region: crude_params[:state_province_region],
			zipcode: crude_params[:zipcode],
			country: crude_params[:country],
			description: crude_params[:description].gsub("\r\n", "<br/>").gsub('"', '&quot;').gsub("'", "&#39;"),
			size_range: crude_params[:size],
			sponsorship_requests: crude_params[:sponsorship_requests].gsub("\r\n", "<br/>").gsub('"', '&quot;').gsub("'", "&#39;"),
			recurrence: crude_params[:recurrence],
			attendees_gender: crude_params[:gender],
			image_url: crude_params[:image_url].downcase.start_with?("http") ? 
				crude_params[:image_url] :
				"http://#{crude_params[:image_url]}",
			date_time_starts: date_time_starts,
			date_time_ends: date_time_ends,
			age_ranges: age_ranges,
			attendees_income_levels: income_levels,
			sponsorship_types: sponsorship_types,
			total_amount: crude_params[:total_amount],
			min_amount: crude_params[:min_amount]
		}

		return eparams
	end

	def crude_params
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
		@event = Event.find_by(identifier: params[:identifier])
	end

	def prepare_aws_vars
		@s3_direct_post = S3_BUCKET.presigned_post(key: "#{SecureRandom.uuid}--${filename}",
			success_action_status: 201, acl: :public_read)

		@aws_fields = @s3_direct_post.fields.to_json
		@aws_url = @s3_direct_post.url.to_s
		@aws_host = @s3_direct_post.url.host
	end
end