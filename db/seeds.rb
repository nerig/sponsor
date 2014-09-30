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
		description: "a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "One-Time Event",
		age_range: "51+",
		attendees_gender: "Both",
		attendees_income_level: "Medium"
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
		description: "a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Weekly",
		age_range: "51+",
		attendees_gender: "Male",
		attendees_income_level: "Low"
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
		description: "a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "36-50",
		attendees_gender: "Female",
		attendees_income_level: "High"
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
		description: "a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Yearly",
		age_range: "21-35",
		attendees_gender: "Female",
		attendees_income_level: "Medium"
	},
	{
		name: 'five',
		size_range: "1000+",
		address1: "there",
		city: "Boston",
		region: "MA",
		zip_code: "02163",
		country: "USA",
		contact_number: "757584847",
		description: "a description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "12-20",
		attendees_gender: "Male",
		attendees_income_level: "Low"
	}])