class WelcomeController < ApplicationController
	def index
		@events = @events = Event.where("date_time_starts > ?", Time.now).sort { |a, b| a.date_time_starts <=> b.date_time_starts}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}
		
		@events.each { |e|
			e.description.gsub!('"', '\"')
		}
		@events = @events.to_json.gsub("'", "&#39;")
			
		@six_events.each { |e|
			e.description.gsub!('"', '\"')
		}
		@six_events = @six_events.to_json.gsub("'", "&#39;")
		
	end
end
