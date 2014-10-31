class SponsorshipResponsesController < ApplicationController
    before_action :set_sponsorship_response, only: [:show, :edit, :update, :destroy]

    def index
        @sponsorship_responses = SponsorshipResponse.all
        respond_with(@sponsorship_responses)
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
        p sponsorship_response_params

        phone_number = sponsorship_response_params[:phone1] + 
            sponsorship_response_params[:phone2] + 
            sponsorship_response_params[:phone3]

        new_response = sponsorship_response_params.clone
        new_response.delete :phone1
        new_response.delete :phone2
        new_response.delete :phone3
        new_response[:phone_number] = phone_number

        @sponsorship_response = SponsorshipResponse.new(new_response)
        @sponsorship_response.save

        # redirect to paypal
        redirect_to @sponsorship_response
    end

    def update
        @sponsorship_response.update(sponsorship_response_params)
        respond_with(@sponsorship_response)
    end

    def destroy
        @sponsorship_response.destroy
        respond_with(@sponsorship_response)
    end

    private
        def set_sponsorship_response
            @sponsorship_response = SponsorshipResponse.find(params[:id])
        end

        def sponsorship_response_params
            params.require(:response).permit(
                :event_id, 
                :first_name,
                :last_name, 
                :email, 
                :phone1,
                :phone2,
                :phone3, 
                :company_name, 
                :title, 
                :offered_sponsorship, 
                :comments)
        end
end
