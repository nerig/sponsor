class WelcomeController < ApplicationController
	def index
		
		@events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}.to_json
		@events = @events.to_json
	end
end
