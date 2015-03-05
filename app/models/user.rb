# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      default(""), not null
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  created_at             :datetime
#  updated_at             :datetime
#  first_name             :string(255)
#  last_name              :string(255)
#  phone                  :string(255)
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

class User < ActiveRecord::Base
	has_many :events
	# Include default devise modules. Others available are:
	# :lockable, :timeoutable and :omniauthable
	# see https://github.com/plataformatec/devise for explanations
	# and don't forget to update a migration when you add or remove
	# a module
	devise :database_authenticatable, :registerable,
		:recoverable, :rememberable, :trackable, :validatable

	#attr_accessor :first_name, :last_name, :phone
end
