require 'mail'

require 'rest_client'
require 'json'
require 'securerandom'
require 'date_core'
require 'time'
require 'active_support/core_ext'

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

		subject = contact_params['subject']
		name = contact_params['name']
		email = contact_params['email']
		message = contact_params['message']

		mail = Mail.deliver do
		  to      'tempaner@gmail.com'
		  from    "#{name} <#{email}>"
		  subject subject

		  text_part do
		    body "New message from #{name}, email: #{email}\r\n\r\n#{message}"
		  end
		end

		redirect_to '/contact-us?message_sent=true'
	end
end

private
	def contact_params
		params.require(:contact).permit(:name, :email, :subject, :message)
	end