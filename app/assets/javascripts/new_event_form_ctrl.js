"use strict";

spons.controller('newEventFormCtrl', ["$scope", function($scope) {
	
	var formElement = get('new-event-form');
	formElement.method = "POST";
	var urlParts = document.URL.split("/");
	if (urlParts[urlParts.length - 1] === "edit") {
		var eventId = urlParts[urlParts.length - 2];
		formElement.action = "/events/" + eventId;
		$('#new-event-form').append($('<input type="hidden" name="_method" value="put" />'));
		get('btn-sbmt-event').value = "Update Event";
		$scope.eventFormTitle = "Edit event";
	} else {
		formElement.action = "/events";
		get('btn-sbmt-event').value = "Create Event";
		$scope.eventFormTitle = "Create a new event!";
	}

	// managing states of the form to show it one part at a time
	$scope.questionsSectionNumber = 1;

	$scope.onNextClick = function() {
		$scope.questionsSectionNumber += 1;
	}

	$scope.onBackClick = function() {
		$scope.questionsSectionNumber -= 1;
	}

	var turnCheckboxesNotificationsOn = function() {
		if ($scope.typesRequired()) {
			$scope.showTypesRequiredNotification = true;
		}

		if ($scope.agesRequired()) {
			$scope.showAgesRequiredNotification = true;
		}

		if ($scope.incomesRequired()) {
			$scope.showIncomesRequiredNotification = true;
		}
	}

	get('btn-sbmt-event').addEventListener('click', function(e) {

		// if form is not valid, submit is not happening
		if ($scope.newEventForm.$invalid) {

			$scope.formIsNotValid = true;

			addValidationsCssRule();
			turnCheckboxesNotificationsOn();
			
			if (!$scope.firstSectionForm.$valid) {
				$scope.onBackClick();
			}

		} else { // submit form
			$scope.formIsNotValid = false;
			$scope.showTypeRequiredNotification = false;
			$scope.showAgesRequiredNotification = false;
			$scope.showIncomesRequiredNotification = false;

			// uploading image
			

			formElement.submit();
		}
    });

    // image handler
    var fileInputElement = get('file-input');
    $scope.fileInputClicked = function() {
    	fileInputElement.click();
    }

    fileInputElement.addEventListener("change", function() {
    	var imageFile = this.files[0];
    	if (imageFile) {
    		$scope.dummyFileName = this.files[0].name;
    		$scope.$apply();

    		var img = get('image-thunbnail');
			img.file = imageFile;

			var reader = new FileReader();
			
			reader.onload = (function(aImg) { return function(e) { 
				aImg.src = e.target.result;
				aImg.style.display = "inherit";
			}; })(img);

			reader.readAsDataURL(imageFile);
    	}
    }, false);

	// date picker settings
	$scope.dateOptions = {
		startingDay: 1,
		showWeeks: false
	};

	var getFormattedDate = function(date, ignoreDay) {
		if (ignoreDay)
			return (date.getMonth() > 8 ? '' : '0') + (date.getMonth() + 1) + '/01/' + date.getFullYear();
		else
			return (date.getMonth() > 8 ? '' : '0') + (date.getMonth() + 1) + '/' + (date.getDate() > 9 ? '' : '0') + date.getDate() + '/' + date.getFullYear();
	}

	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	if (month >= 10) {
	    var current = new Date(year + 1, (month == 10) ? 0 : 1, 1);
	} else {
	    var current = new Date(year, month + 2, 1);
	}
	$scope.dateStarts = getFormattedDate(current, true);
	$scope.dateEnds = $scope.dateStarts;
	$scope.minDate = new Date();

	$scope.newDateStartsSelected = function() {
		$scope.dateEnds = getFormattedDate($scope.dateStarts, false);
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

	var hiddenTimeStartsElement = get('hidden-time-starts');
	hiddenTimeStartsElement.value = "7:00 PM";
	var hiddenTimeEndsElement = get('hidden-time-ends');
	hiddenTimeEndsElement.value = "10:00 PM";

	$scope.onTimeStartsSelected = function(time) {
		get('time-starts').innerHTML = time;
		hiddenTimeStartsElement.value = time;
	}
	$scope.onTimeEndsSelected = function(time) {
		get('time-ends').innerHTML = time;
		hiddenTimeEndsElement.value = time;
	}

	// event size dropdown
	$scope.sizes = ["0-50", "50-100", "100-500", "500-1000", "1000+"];

	$scope.onSizeSelected = function(size) {
		get('size-hidden-input').value = size;
		get('size-button').innerHTML = size + ' <span class="caret"></span>';
	}

	// countries dropdown
	$scope.onCountrySelected = function(country) {
		$scope.countryInputText = country;
	}

	$scope.countryInputText = "United States";

	$scope.regionRequired = function() {
		return ($scope.countryInputText === "United States");
	}

	// sponsorship types settings
	$scope.cbCapital = false;
	$scope.onCapitalClick = function() {
		var element = get('cb-capital');
		element.checked = !element.checked;
		$scope.cbCapital = !$scope.cbCapital;
	}

	$scope.onMerchandiseClick = function() {
		var element = get('cb-merchandise');
		element.checked = !element.checked;
	}

	$scope.onDiscountsClick = function() {
		var element = get('cb-discounts');
		element.checked = !element.checked;
	}

	$scope.onTypesChange = function () {
		if (!$scope.typesRequired()) {
			$scope.showTypesRequiredNotification = false;
		}
	}

	$scope.typesRequired = function() {
		return (!get('cb-capital').checked && !get('cb-merchandise').checked && !get('cb-discounts').checked);
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

	$scope.onAgesChange = function () {
		if (!$scope.agesRequired()) {
			$scope.showAgesRequiredNotification = false;
		}
	}

	$scope.agesRequired = function() {
		return (!get('cb-12-20').checked && !get('cb-21-35').checked && !get('cb-36-50').checked && !get('cb-51').checked);
	}

	// recurrence settings
	$scope.ocurrences = ["One-time event", "Weekly", "Monthly", "Yearly"];

	$scope.onRecurrenceSelected = function(recurrence) {
		get('recurrence-hidden-input').value = recurrence;
		get('recurrence-button').innerHTML = recurrence + ' <span class="caret"></span>';
	}

	// gender settings
	$scope.genders = ["Both", "Female", "Male"];

	$scope.onGenderSelected = function(gender) {
		get('gender-hidden-input').value = gender;
		get('gender-button').innerHTML = gender + ' <span class="caret"></span>';
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

	$scope.onIncomesChange = function () {
		if (!$scope.incomesRequired()) {
			$scope.showIncomesRequiredNotification = false;
		}
	}

	$scope.incomesRequired = function() {
		return (!get('cb-income-low').checked && !get('cb-income-med').checked && !get('cb-income-high').checked);
	}

	$scope.totalAmountChanged = function() {
		$scope.newEventForm["event[min_amount]"].$validate();
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
}])

.directive("validateMinAmount", function() {
	// requires an isloated model
	return {
		// restrict to an attribute type.
		restrict: 'A',
		// element must have ng-model attribute.
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {

			function validate(value) {
				if (value && scope.totalAmount) {

					var isValid = false;
					if (parseInt(value) <= scope.totalAmount)
						isValid = true;

					ctrl.$setValidity('invalidMinAmount', isValid);
				}

				return isValid ? value : undefined;
			}

			ctrl.$parsers.unshift(validate);
		}
	}
});



