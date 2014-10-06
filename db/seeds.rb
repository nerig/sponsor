# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Event.create([
	{
		name: 'one',
		size_range: "0-50",
		address1: "there",
		city: "New York",
		region: "NY",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a description a description a description a description a description a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "One-Time Event",
		age_range: "51+",
		attendees_gender: "Both",
		attendees_income_level: "Medium",
		date: "11/26/2014",
		image_url: "https://s3.amazonaws.com/rmktimages/logo5.png"
	},
	{
		name: 'two',
		size_range: "50-100",
		address1: "there",
		city: "Boston",
		region: "MA",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a description a description a description a description a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Weekly",
		age_range: "51+",
		attendees_gender: "Male",
		attendees_income_level: "Low",
		date: "11/25/2014",
		image_url: "https://s3.amazonaws.com/rmktimages/logo4.jpg"
	},
	{
		name: 'tree',
		size_range: "100-500",
		address1: "there",
		city: "Boston",
		region: "MA",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a description a description a description a description a description a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "36-50",
		attendees_gender: "Female",
		attendees_income_level: "High",
		date: "11/28/2014",
		image_url: "https://s3.amazonaws.com/rmktimages/logo3.png"
	},
	{
		name: 'four',
		size_range: "500-1000",
		address1: "there",
		city: "Los Angeles",
		region: "CA",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a descriptio a description a description a description a description a descriptionn",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Yearly",
		age_range: "21-35",
		attendees_gender: "Female",
		attendees_income_level: "Medium",
		date: "11/27/2014",
		image_url: "https://s3.amazonaws.com/rmktimages/logo2.jpg"
	},
	{
		name: 'five',
		size_range: "1000+",
		address1: "there",
		city: "Very Long String City",
		region: "MA",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a desc a description a description a description a description a descriptionription",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "12-20",
		attendees_gender: "Male",
		attendees_income_level: "Low",
		date: "11/29/2014",
		image_url: "https://s3.amazonaws.com/rmktimages/logo1.JPG"
	}])