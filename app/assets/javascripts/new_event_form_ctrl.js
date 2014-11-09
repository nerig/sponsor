"use strict";

spons.controller('newEventFormCtrl', ["$scope", function($scope) {
	
	// managing states of the form to show it one part at a time
	$scope.questionsSectionNumber = 1;

	$scope.onNextClick = function() {
		$scope.questionsSectionNumber += 1;
	}

	$scope.onBackClick = function() {
		$scope.questionsSectionNumber -= 1;
	}

	// date picker settings
	$scope.dateOptions = {
		startingDay: 1,
		showWeeks: false
	};

	$scope.minDate = new Date();

	$scope.toggleCalendar = function(event) {
		event.preventDefault();
		event.stopPropagation();

		$scope.isOpened = !$scope.isOpened;
	}

	// time picker settings

	$scope.times = ["12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM",
		"2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM",
		"4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM",
		"6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM",
		"8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
		"10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
		"12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
		"2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
		"4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
		"6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
		"8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
		"10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]

	$scope.onTimeSelected = function(time) {
		$scope.timeInputText = time;
	}

	// event size dropdown
	$scope.onSizeSelected = function(size) {
		$scope.sizeInputText = size;
	}

	// countries dropdown
	$scope.onCountrySelected = function(country) {
		$scope.countryInputText = country;
	}

	// sponsorship types settings
	$scope.onCapitalClick = function() {
		var element = get('cb-capital');
		element.checked = !element.checked;
	}

	$scope.onMerchandiseClick = function() {
		var element = get('cb-merchandise');
		element.checked = !element.checked;
	}

	$scope.onDiscountsClick = function() {
		var element = get('cb-discounts');
		element.checked = !element.checked;
	}

	// ages settings
	$scope.on12_20Click = function() {
		var element = get('cb-12-20');
		element.checked = !element.checked;
	}

	$scope.on21_35Click = function() {
		var element = get('cb-21-35');
		element.checked = !element.checked;
	}

	$scope.on36_50Click = function() {
		var element = get('cb-36-50');
		element.checked = !element.checked;
	}

	$scope.on51Click = function() {
		var element = get('cb-51');
		element.checked = !element.checked;
	}

	// recurrence settings
	$scope.onRecurrenceSelected = function(recurrence) {
		$scope.recurrenceInputText = recurrence;
	}

	// gender settings
	$scope.onGenderSelected = function(gender) {
		$scope.genderInputText = gender;
	}

	// income settings
	$scope.onIncomeLowClick = function() {
		var element = get('cb-income-low');
		element.checked = !element.checked;
	}

	$scope.onIncomeMedClick = function() {
		var element = get('cb-income-med');
		element.checked = !element.checked;
	}

	$scope.onIncomeHighClick = function() {
		var element = get('cb-income-high');
		element.checked = !element.checked;
	}

	$scope.countries = ["Afghanistan", "Albania", "Algeria", "Andorra", 
		"Antigua and Barbuda", "Argentina", "Armenia", 
		"Australia", "Austria", "Azerbaijan", "Bahamas", 
		"Bahrain", "Bangladesh", "Barbados", "Belarus", 
		"Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
		"Bosnia and Herzegovina", "Botswana", "Brazil", 
		"Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
		"Cambodia", "Cameroon", "Canada", "Cape Verde", 
		"Central African Republic", "Chad", "Chile", 
		"China", "Colombia", "Comoros", "Congo", "Costa Rica", 
		"Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", 
		"Czech Republic", "Denmark", "Djibouti", "Dominica", 
		"Dominican Republic", "East Timor", "Ecuador", 
		"Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", 
		"Estonia" , "Ethiopia", "Fiji", "Finland", "France", 
		"Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
		"Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
		"Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", 
		"Iceland", "India", "Indonesia", "Iran", "Iraq", 
		"Ireland", "Israel", "Italy", "Jamaica", "Japan", 
		"Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", 
		"South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
		"Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
		"Lithuania", "Luxembourg", "Macedonia", "Madagascar", 
		"Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
		"Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
		"Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
		"Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
		"Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", 
		"Norway", "Oman", "Pakistan", "Palau", "Panama", 
		"Papua New Guinea", "Paraguay", "Peru", "Philippines", 
		"Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", 
		"Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
		"Saint Vincent and the Grenadines", "Samoa", "San Marino", 
		"Sao Tome and Principe", "Saudi Arabia", "Senegal", 
		"Serbia and Montenegro", "Seychelles", "Sierra Leone", 
		"Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
		"Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", 
		"Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", 
		"Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", 
		"Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
		"Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
		"United Arab Emirates", "United Kingdom", "United States", 
		"Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", 
		"Vietnam", "Yemen", "Zambia", "Zimbabwe"];
}]);