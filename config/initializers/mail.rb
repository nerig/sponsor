require 'mail'

Mail.defaults do
  delivery_method :smtp, {
    :port      => 587,
    :address   => "smtp.mandrillapp.com",
    :user_name => ENV["MANDRILL_USERNAME"],
    :password  => ENV["MANDRILL_PASSWORD"]
  }
end