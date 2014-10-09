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
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras maximus, tellus vel dictum convallis, arcu odio ornare nulla, gravida tincidunt est nunc a quam. Nullam ornare nec tellus volutpat lobortis. Duis lorem massa, dignissim eu consequat ultricies, blandit at dolor. Etiam at faucibus lectus. Nam in dolor massa. Sed ac semper lectus. Aliquam lobortis metus commodo, laoreet purus sit amet, blandit massa. Aenean id auctor lorem, eget dapibus dolor. Ut purus tortor, interdum eget pellentesque in, malesuada et lorem. Curabitur varius vitae est nec blandit. Donec et ligula eu nibh cursus finibus. Pellentesque feugiat velit in ipsum congue, ac hendrerit sapien tempus. Ut luctus ultrices lacus vitae tristique. Suspendisse tempus, orci hendrerit fermentum elementum, eros eros condimentum est, id aliquet leo tortor a odio.",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "One-Time Event",
		age_range: "51+",
		attendees_gender: "Both",
		attendees_income_level: "Medium",
		date: "1416990000000",
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
		description: "Short description",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Weekly",
		age_range: "51+",
		attendees_gender: "Male",
		attendees_income_level: "Low",
		date: "1416960000000",
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
		description: "Vivamus cursus lectus sollicitudin nibh volutpat pulvinar. Vestibulum non luctus urna, et tincidunt tortor. Mauris et tincidunt eros. Cras id tellus elementum, vestibulum ligula ut, pellentesque velit. Vestibulum consequat mauris sed erat suscipit luctus. Aenean ligula justo, mollis ut convallis ac, iaculis ut ipsum. Maecenas non vehicula metus.",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "36-50",
		attendees_gender: "Female",
		attendees_income_level: "High",
		date: "1417060000000",
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
		description: "Sed maximus felis non pharetra laoreet. Aenean feugiat ultricies posuere. Curabitur eleifend vel eros posuere sollicitudin. Nulla ullamcorper, metus id cursus sodales, lectus leo suscipit tortor, ac scelerisque dolor nulla vitae dolor. Mauris scelerisque, est nec lacinia consectetur, sapien ipsum maximus purus, molestie dignissim dolor elit a odio. Mauris ligula tellus, gravida at congue quis, luctus at dolor. Suspendisse commodo lacus id accumsan dictum. Nam congue laoreet nulla, a auctor mauris mollis eu. Suspendisse non ipsum in erat facilisis porta. Mauris egestas risus mauris, at aliquet turpis ullamcorper eget. Aliquam eget sollicitudin leo, vel placerat tellus. In sollicitudin ornare bibendum. Aenean in euismod massa. Vivamus lacinia vel ligula non pellentesque. Nulla ut mauris vitae velit mattis ultricies ut cursus erat. Donec eget ligula quam.",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Yearly",
		age_range: "21-35",
		attendees_gender: "Female",
		attendees_income_level: "Medium",
		date: "1417960000000",
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
		description: "Duis at velit ac diam elementum congue vitae non massa. Nam posuere varius nisi et congue. Suspendisse tempor, massa eu aliquet tempus, nisi ex viverra augue, vitae suscipit mi tortor nec tellus. Integer sed ex luctus, tincidunt tortor id, scelerisque nisl. Duis tincidunt et lacus vel laoreet. Nullam et rhoncus tellus. Morbi quis risus id augue tincidunt lacinia. Donec rutrum mi eget feugiat vulputate. Sed felis nibh, aliquam a augue vitae, vulputate fringilla nunc. Maecenas euismod interdum lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ac porttitor lorem. Cras laoreet elit eu urna efficitur, quis porta lectus dapibus.",
		sponsorship_type: "Capital Contribution",
		sponsorship_requests: "some requests",
		recurrence: "Monthly",
		age_range: "12-20",
		attendees_gender: "Male",
		attendees_income_level: "Low",
		date: "1426960000000",
		image_url: "https://s3.amazonaws.com/rmktimages/logo1.JPG"
	}])