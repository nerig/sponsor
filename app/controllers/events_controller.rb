class EventsController < ApplicationController

	# action to show all events
	def index
		@events = "showing all events and a filter to filter them"
		#@events = Event.all
	end

	# action taken when a user wants to create a new event
	def new
	end

	# action taken when a user submits a new event
	def create
	end


end
