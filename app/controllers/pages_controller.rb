require 'mail'
require 'rest_client'
require 'json'
require 'securerandom'
require 'date_core'
require 'time'
require 'active_support/core_ext'


class PagesController < ApplicationController
	def about
		if not $done_once
			response = JSON.parse(RestClient.get 'https://www.kimonolabs.com/api/ay0rrtai?apikey=17a18db9e3cdb4ff0bed37c79b7455a9')

			response["results"]["event"].each { |event|
				next if event["name"].blank?
				next if event["date_time"].blank?
				next if event["description"].blank?
				next if event["city"].blank?
				next if event["address"].blank? && event["address_prop_name"].blank?

				address1 = nil
				address2 = ""
				if not event['address'].blank?
					if not event['address'].include? "\n"
						address1 = event['address'] 
					else
						splitsies = event['address'].split("\n")
						if (splitsies.count == 2) && (splitsies[0].to_i != 0) && (not splitsies[1].include? " ")
							address1 = "#{splitsies[0]} #{splitsies[1]}"
						else
							address1 = splitsies[0]
							address2 = splitsies[1]
						end
					end
				else
					address1 = event["address_prop_name"]
				end

				times = event["date_time"].split(" - ")
				timezone = event["date_time"].split.last
				if not timezone.start_with? "("
					timezone = "(EDT)"
				end
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

				next if date_time_starts <= Time.now
				next if date_time_ends <= Time.now
					
				description = event["description"]
				if not event["description"]["text"].blank?
					description = event["description"]["text"]
				end

				Event.create(
					identifier: "#{SecureRandom.random_number(36**5).to_s(36).rjust(5, "0")}-#{event["name"].parameterize}",
					user_id: 7,
					name: event["name"],
					address1: address1,
					address2: address2,
					city: event['city'],
					region: "MA",
					zipcode: event['zipcode'],
					country: "United States",
					description: description.gsub("\n", "<br/>").gsub('"', '&quot;').gsub("'", "&#39;"),
					size_range: "100-500",
					recurrence: "One-time event",
					attendees_gender: "Both",
					image_url: event["logo"].blank? ? "/assets/no-image.JPG" : event["logo"],
					date_time_starts: date_time_starts,
					date_time_ends: date_time_ends,
					age_ranges: ["21-35"],
					attendees_income_levels: ["medium"],
					sponsorship_types: ["capital", "merchandise", "discounts"],
					sponsorship_requests: ""
					)
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