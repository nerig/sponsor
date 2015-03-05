class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_action :configure_permitted_parameters, if: :devise_controller?

	def after_sign_in_path_for(resource)
		stored_location_for(resource) || super
	end

	def after_sign_out_path_for(resource_or_scope)
		request.referrer
	end

protected
	def configure_permitted_parameters
		devise_parameter_sanitizer.for(:sign_in) { |u| u.permit(:email, :password, :remember_me) }
		devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:first_name, :last_name, :email, :password, :phone) }
		devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:first_name, :last_name, :email, :password, :phone, :current_password) }
	end

end
