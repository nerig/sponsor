class Users::SessionsController < Devise::SessionsController
	after_filter :store_referrer, only: [:new]

protected
	def store_referrer
		store_location_for(:user, request.referrer)
	end
end