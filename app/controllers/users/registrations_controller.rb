class Users::RegistrationsController < Devise::RegistrationsController
	respond_to :json, :html

	def create
		build_resource(sign_up_params)

		resource_saved = resource.save
		yield resource if block_given?
		if resource_saved
			if resource.active_for_authentication?
				set_flash_message :notice, :signed_up if is_flashing_format?
				sign_up(resource_name, resource)

				resource_id = { id: resource.id }

				respond_to do |format|
					format.json { render json: resource_id }
					format.html { redirect_to(after_sign_up_path_for(resource)) }
				end
			else
				set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
				expire_data_after_sign_in!
				respond_with resource, location: after_inactive_sign_up_path_for(resource)
			end
		else
			clean_up_passwords resource
			@validatable = devise_mapping.validatable?
			if @validatable
				@minimum_password_length = resource_class.password_length.min
			end
			respond_with resource
		end
	end
end