json.array!(@sponsorship_responses) do |sponsorship_response|
  json.extract! sponsorship_response, :id, :first_name, :last_name, :email, :phone_number, :company_name, :title, :offered_sponsorship, :comments
  json.url sponsorship_response_url(sponsorship_response, format: :json)
end
