require 'mail'

class PagesController < ApplicationController
	def about
	end

	def brand
	end

	def event
	end

	def contact
		if params['message_sent']
			@message_sent = true
		end
	end

	def send_contact
		Mail.defaults do
		  delivery_method :smtp, {
		    :port      => 587,
		    :address   => "smtp.mandrillapp.com",
		    :user_name => "tempaner@gmail.com",
		    :password  => "Yd-IV-Bp5Kfae_xjugej5Q"
		  }
		end

		subject = contact_params['subject']
		name = contact_params['name']
		email = contact_params['email']
		message = contact_params['message']

		mail = Mail.deliver do
		  to      'tempaner@gmail.com'
		  from    'Marketiers Contact Us <mrktiers@gmail.com>' # Your from name and email address
		  subject subject

		  text_part do
		    body "New message from #{name}, email: #{email}\n\r\n\r#{message}"
		  end
		end

		redirect_to '/contact-us?message_sent=true'
	end
end

private
	def contact_params
		params.require(:contact).permit(:name, :email, :subject, :message)
	end