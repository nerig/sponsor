class SponsorshipResponsesController < ApplicationController
    before_action :set_sponsorship_response, only: [:show, :edit, :update, :destroy]

    def index
    end

    def show
    end

    def new
        @event = Event.find_by(id: params['event_id'])

        raise "event not found" if not @event
    end

    def edit
    end

    def create
        @sponsorship_response = SponsorshipResponse.new(sponsorship_response_params)
        @sponsorship_response.save

        # redirect to paypal
        redirect_to @sponsorship_response
    end

    def update
    end

    def destroy
    end

    private
        def set_sponsorship_response
            @sponsorship_response = SponsorshipResponse.find(params[:id])
        end

        def sponsorship_response_params
            params.require(:response).permit(
                :event_id, :first_name, :last_name, 
                :email, :phone_number, :company_name, 
                :title, :offered_sponsorship, :comments)
        end
end
