class WelcomeController < ApplicationController
	def index
		all_events_sorted = Event.all.sort { |a, b| a.date_time <=> b.date_time}
		@six_events = all_events_sorted[0..5].to_json
		@events = all_events_sorted.to_json
	end
end
