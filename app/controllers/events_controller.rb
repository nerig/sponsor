class EventsController < ApplicationController
	before_action :authenticate_user!,
		:only => [:new, :create]

	# action to show all events
	def index
		@events = Event.all.to_json
	end

	# action taken when a user wants to create a new event
	def new
	end

	# action taken when a user submits a new event
	def create
		@event = Event.new(event_params)
 
		@event.save
		redirect_to @event
	end

	# action to show one event by id
	def show
		@event = Event.find(params[:id])
	end


private
	def event_params
		params.require(:event).permit(
			:name, 
			:size, 
			:address1,
			:address2,
			:city,
			:region,
			:zip_code,
			:country,
			:date,
			:time,
			:contact_number,
			:description
			)
	end
end