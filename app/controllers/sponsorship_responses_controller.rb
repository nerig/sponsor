require 'stripe'

class SponsorshipResponsesController < ApplicationController
    before_action :set_sponsorship_response, only: [:show, :edit, :update, :destroy]

    def index
    end

    def show
        @event = Event.find_by(id: @sponsorship_response.event_id)
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

        # Create the charge on Stripe's servers - this will charge the user's card
        begin
            Stripe.api_key = "sk_test_AszVo3Z8gOO2X324y01pLzZj"
            charge = Stripe::Charge.create(
                :amount => (@sponsorship_response.amount * 100).to_i,
                :currency => "usd",
                :card => token["payment_token"],
                :description => "Sponsorship response ID: #{@sponsorship_response.id}")
            # save charge
        rescue Stripe::CardError => e
            

        end


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
                :event_id, :first_name, :last_name, :email,
                :phone_number, :company_name, :title,
                :offered_sponsorship, :comments, :amount)
        end

        def token
            params.require(:response).permit(:payment_token)
        end
end
