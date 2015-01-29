class WelcomeController < ApplicationController
	def index
		
		# temp code to decapitalize attendees_income_levels in the already saved events
		Event.all.each { |e|
			levels = []
			e.attendees_income_levels.each { |il| levels << il.downcase }
			e.update(attendees_income_levels: levels)
		}

		@events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}.to_json
		@events = @events.to_json
	end
end
