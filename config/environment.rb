# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!

ActiveRecord::Base.logger.level = 1

def log(text)
  Rails.logger.info(text)
end

ENV['AWS_REGION'] = 'us-east-1'
ENV['AWS_ACCESS_KEY'] = 'AKIAIJRNTIF5T2RJHS3Q'
ENV['AWS_SECRET_ACCESS_KEY'] = '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'