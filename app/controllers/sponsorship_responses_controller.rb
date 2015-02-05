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

        notify_sponsorship

        # Create the charge on Stripe's servers - this will charge the user's card
        begin
            Stripe.api_key = ENV["STRIPE_SECRET_KEY"]
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
        def notify_sponsorship
            subject = "Someone wants to sponsor an event with id #{sponsorship_response_params[:event_id]}!"
            name = "Marketiers new sponsorship"
            email = "mrktiers@gmail.com"
            message = "Take a look - a sponsorship was added. Details:\r\n
                Name: #{sponsorship_response_params[:first_name]} #{sponsorship_response_params[:last_name]}\r\n
                Email: #{sponsorship_response_params[:email]}\r\n
                Phone: #{sponsorship_response_params[:phone_number]}\r\n
                Company name: #{sponsorship_response_params[:company_name]}\r\n
                Title: #{sponsorship_response_params[:title]}\r\n
                Amount: $#{sponsorship_response_params[:amount]}\r\n
                Offered sponsorship: #{sponsorship_response_params[:offered_sponsorship]}\r\n
                Comments: #{sponsorship_response_params[:comments]}"

            mail = Mail.deliver do
              to      'tempaner@gmail.com'
              from    "#{name} <#{email}>"
              subject subject

              text_part do
                body message
              end
            end
        end


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
