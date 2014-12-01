class WelcomeController < ApplicationController
	def index
		@events = Event.all.sort { |a, b| a.date_time <=> b.date_time}
		@six_events = @events[0..5].map { |e|
			Marshal.load(Marshal.dump(e))
		}
		
		@events.each { |e|
			e.description.gsub!('"', '\"')
		}
		@events = @events.to_json.gsub("'", "\'")
			
		@six_events.each { |e|
			e.description.gsub!('"', '\"')
		}
		@six_events = @six_events.to_json.gsub("'", "\'")
		
	end
end
