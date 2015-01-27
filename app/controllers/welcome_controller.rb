class WelcomeController < ApplicationController
	def index

		# temp code to change events descriptions to be with <br/> instead of <br />
		Event.all.each { |e| 
			e.update(description: e.description.gsub("<br />", "<br/>"), 
				sponsorship_requests: e.sponsorship_requests.gsub("<br />", "<br/>"))
		}
		
		@events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}.to_json
		@events = @events.to_json
	end
end
