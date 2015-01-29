class WelcomeController < ApplicationController
	def index
		
		# temp code to decapitalize sponsorship types in the already saved events
		Event.all.each { |e|
			types = []
			e.sponsorship_types.each { |st| types << st.downcase }
			e.update(sponsorship_types: types)
		}

		@events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}.to_json
		@events = @events.to_json
	end
end
