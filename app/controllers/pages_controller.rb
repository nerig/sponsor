require 'mail'

require 'rest_client'
require 'JSON'
require 'securerandom'
require 'date_core'
require 'time'
require 'active_support/core_ext'

class PagesController < ApplicationController
	def about
		if not $done_once
			response = JSON.parse(RestClient.get 'https://www.kimonolabs.com/api/97truu62?apikey=17a18db9e3cdb4ff0bed37c79b7455a9')

			response["results"]["event"].each { |event|
				next if event["name"].blank?
				next if event["date_time"].blank?
				next if event["city"].blank?
				next if event["address"].blank?
	
				timezone = event["date_time"].split.last
				if not timezone.start_with? "("
					timezone = "(EDT)"
					event["date_time"] = "#{event["date_time"]} #{timezone}"
				end
				times = event["date_time"].split(" - ")
				begin
					if times.count == 2
						date_time_starts = Time.parse(DateTime.strptime("#{times[0]} #{timezone}", "%A, %B %e, %Y at %l:%M %p (%Z)").to_s)
						date_time_ends = Time.parse(DateTime.strptime(times[1], "%A, %B %e, %Y at %l:%M %p (%Z)").to_s)
					else # event end on start day
						if event["date_time"].include? " at " # event end time is not known
							date_time_starts = Time.parse(DateTime.strptime(event["date_time"], "%A, %B %e, %Y at %l:%M %p (%Z)").to_s)
							date_time_ends  = date_time_starts + 2.hours
						else
							date_and_times = event["date_time"].split(" from ")
							specific_times = date_and_times[1].split(" to ")

							date_format = "%A, %B %e, %Y"
							if date_and_times[0].split[1].to_i != 0
								# date format is %e %B %Y
								date_format = "%A, %e %B %Y"
							end
							time_format = "%l:%M %p (%Z)"
							if not (specific_times[0].include?(" AM") || specific_times[0].include?(" PM"))
								time_format = "%k:%M (%Z)"
							end

							datetime_format = "#{date_format} #{time_format}"

							date_time_starts = Time.parse(DateTime.strptime("#{date_and_times[0]} #{specific_times[0]} #{timezone}", datetime_format).to_s)
							date_time_ends = Time.parse(DateTime.strptime("#{date_and_times[0]} #{specific_times[1].split(' (')[0]} #{timezone}", datetime_format).to_s)
						end
					end
				rescue
					next
				end

				next if date_time_starts <= Time.now
				next if date_time_ends <= Time.now

				event['url']["?aff=es2"] = ""

				new_event = Event.new(
					identifier: "#{SecureRandom.random_number(36**5).to_s(36).rjust(5, "0")}-#{event["name"].parameterize}",
					user_id: 7,
					name: event["name"],
					address1: event["address"],
					address2: nil,
					city: event['city'].strip.titleize, # normalizing city names
					region: event['region'],
					zipcode: event['zipcode'],
					country: event['country'],
					description: "See #{event['url']} for details.",
					size_range: "100-500",
					recurrence: "One-time event",
					attendees_gender: "Both",
					date_time_starts: date_time_starts,
					date_time_ends: date_time_ends,
					age_ranges: ["21-35"],
					attendees_income_levels: ["medium"],
					sponsorship_types: ["capital", "merchandise", "discounts"],
					sponsorship_requests: ""
					)

				# logos arriving from eventbrite might be too long (>255)
				image_affix = "https://img.evbuc.com/https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F"
				unless event["logo"].blank?
					new_event.image_url = event["logo"]
					new_event.image_url.sub!(image_affix, "~!shrtn!~")
				else
					new_event.image_url = "/assets/no-image.JPG"
				end

				new_event.save
			}
		end
		$done_once = 1
	end

	def brand
	end

	def event
	end

	def contact
		if params['message_sent']
			@message_sent = true
		end
	end

	def send_contact

		subject = contact_params['subject']
		name = contact_params['name']
		email = contact_params['email']
		message = contact_params['message']

		mail = Mail.deliver do
		  to      'tempaner@gmail.com'
		  from    "#{name} <#{email}>"
		  subject subject

		  text_part do
		    body "New message from #{name}, email: #{email}\r\n\r\n#{message}"
		  end
		end

		redirect_to '/contact-us?message_sent=true'
	end
end

private
	def contact_params
		params.require(:contact).permit(:name, :email, :subject, :message)
	end