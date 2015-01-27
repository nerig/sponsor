"use strict";

angular.module('spons').controller('newEventFormCtrl', ["$scope", "$attrs", function($scope, $attrs) {
	
	var formElement = get('new-event-form');
	formElement.method = "POST";
	var urlParts = document.URL.split("/");
	if ($scope.$parent.eventToEdit != undefined) {
		// this is an edit scenario

		formElement.action = "/events/" + $scope.$parent.eventToEdit.identifier;
		$('#new-event-form').append($('<input type="hidden" name="_method" value="put" />'));
		get('btn-sbmt-event').value = "Update";
		$scope.eventFormTitle = "Edit event";
		$scope.eventFormSubTitle = "";
	} else {
		formElement.action = "/events";
		get('btn-sbmt-event').value = "Create";
		$scope.eventFormTitle = "Create a new event!";
		$scope.eventFormSubTitle = "Please fill out all the fields.";
	}

	// managing states of the form to show it one part at a time
	$scope.questionsSectionNumber = 1;

	$scope.onNextClick = function() {
		if ($scope.questionsSectionNumber >= 2) {
			$scope.questionsSectionNumber = 2;
			return;
		}

		$scope.questionsSectionNumber += 1;
	}

	$scope.onBackClick = function() {
		if ($scope.questionsSectionNumber <= 1) {
			$scope.questionsSectionNumber = 1;
			return;
		}

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

	// used when submit button is clicked and we want to only save part of the data
	var putPartialFormDataIntoCookie = function() {
		
		if ($scope.firstName != undefined) setCookie("firstName", $scope.firstName, true);
		if ($scope.lastName != undefined) setCookie("lastName", $scope.lastName, true);
		if ($scope.email != undefined) setCookie("email", $scope.email, true);
		if ($scope.phone != undefined) setCookie("phone", $scope.phone, true);
		if ($scope.city != undefined) setCookie("city", $scope.city, true);
		if ($scope.regionInputText != undefined) setCookie("region", $scope.regionInputText, true);
		if ($scope.zipcode != undefined) setCookie("zipcode", $scope.zipcode, true);
		if ($scope.countryInputText != undefined) setCookie("country", $scope.countryInputText, true);

		// delete all other cookies so the form is empty where relevant
		if (getCookie("type") != "full") {
			setCookie("type", "partial", true);

			deleteCookie("eventName");
			deleteCookie("logoImageUrl");
			deleteCookie("startDate");
			deleteCookie("startTime");
			deleteCookie("endDate");
			deleteCookie("endTime");
			deleteCookie("recurrence");
			deleteCookie("size");
			deleteCookie("gender");
			deleteCookie("description");
			deleteCookie("address1");
			deleteCookie("address2");
			deleteCookie("cbCapital");
			deleteCookie("cbDiscounts");
			deleteCookie("cbMerchandise");
			deleteCookie("totalAmount");
			deleteCookie("minAmount");
			deleteCookie("sponsorshipRequests");
			deleteCookie("age1220");
			deleteCookie("age2135");
			deleteCookie("age3650");
			deleteCookie("age51");
			deleteCookie("incomeLow");
			deleteCookie("incomeMed");
			deleteCookie("incomeHigh");
		}
	}

	// used when submit buttun is NOT clicked and we want to save all the data
	var putAllFormDataIntoCookie = function() {
		setCookie("type", "full", false);

		putPartialFormDataIntoCookie();

		setCookie("questionsSectionNumber", $scope.questionsSectionNumber, false);

		if ($scope.eventName != undefined) setCookie("eventName", $scope.eventName, false);
		var hiddenImageUrlElement= get('hidden-image-url');
		if (hiddenImageUrlElement.value != undefined && hiddenImageUrlElement.value != "") {
			var url = (hiddenImageUrlElement.value.indexOf("http") == -1) ? 
				"http://" + hiddenImageUrlElement.value :
				hiddenImageUrlElement.value;
			setCookie("logoImageUrl", url, false);
		}
		if ($scope.dateStarts != undefined) setCookie("dateStarts", $scope.dateStarts, false);
		var hiddenTimeStartsElement = get('hidden-time-starts');
		if (hiddenTimeStartsElement.value != undefined) setCookie("timeStarts", hiddenTimeStartsElement.value, false);
		if ($scope.dateEnds != undefined) setCookie("dateEnds", $scope.dateEnds, false);
		var hiddenTimeEndsElement = get('hidden-time-ends');
		if (hiddenTimeEndsElement.value != undefined) setCookie("timeEnds", hiddenTimeEndsElement.value, false);
		var recurrenceHiddenInputElement = get('recurrence-hidden-input');
		if (recurrenceHiddenInputElement.value != undefined) setCookie("recurrence", recurrenceHiddenInputElement.value, false);
		var sizeHiddenInputElement = get('size-hidden-input');
		if (sizeHiddenInputElement.value != undefined) setCookie("size", sizeHiddenInputElement.value, false);
		var genderHiddenInputElement = get('gender-hidden-input');
		if (genderHiddenInputElement.value != undefined) setCookie("gender", genderHiddenInputElement.value, false);
		if ($scope.description != undefined) setCookie("description", $scope.description, false);
		if ($scope.address1 != undefined) setCookie("address1", $scope.address1, false);
		if ($scope.address2 != undefined) setCookie("address2", $scope.address2, false);
		if ($scope.cbCapital != undefined) setCookie("cbCapital", $scope.cbCapital, false);
		if ($scope.cbDiscounts != undefined) setCookie("cbDiscounts", $scope.cbDiscounts, false);
		if ($scope.cbMerchandise != undefined) setCookie("cbMerchandise", $scope.cbMerchandise, false);
		if ($scope.totalAmount != undefined) setCookie("totalAmount", $scope.totalAmount, false);
		if ($scope.minAmount != undefined) setCookie("minAmount", $scope.minAmount, false);
		if ($scope.sponsorshipRequests != undefined) setCookie("sponsorshipRequests", $scope.sponsorshipRequests, false);
		if ($scope.age1220 != undefined) setCookie("age1220", $scope.age1220, false);
		if ($scope.age2135 != undefined) setCookie("age2135", $scope.age2135, false);
		if ($scope.age3650 != undefined) setCookie("age3650", $scope.age3650, false);
		if ($scope.age51 != undefined) setCookie("age51", $scope.age51, false);
		if ($scope.incomeLow != undefined) setCookie("incomeLow", $scope.incomeLow, false);
		if ($scope.incomeMed != undefined) setCookie("incomeMed", $scope.incomeMed, false);
		if ($scope.incomeHigh != undefined) setCookie("incomeHigh", $scope.incomeHigh, false);
	}

	$(window).on('load', function() {
    	
		var tempVal = getCookie("firstName");
		if (tempVal != undefined) $scope.firstName = tempVal;

		tempVal = getCookie("lastName");
		if (tempVal != undefined) $scope.lastName = tempVal;

		tempVal = getCookie("email");
		if (tempVal != undefined) $scope.email = tempVal;

		tempVal = getCookie("phone");
		if (tempVal != undefined) $scope.phone = tempVal;

		tempVal = getCookie("city");
		if (tempVal != undefined) $scope.city = tempVal;

		tempVal = getCookie("region");
		if (tempVal != undefined) $scope.regionInputText = tempVal;

		tempVal = getCookie("zipcode");
		if (tempVal != undefined) $scope.zipcode = tempVal;

		tempVal = getCookie("country");
		if (tempVal != undefined) $scope.countryInputText = tempVal;

    	if (getCookie("type") === "full")
    	{
    		tempVal = getCookie("eventName");
			if (tempVal != undefined) $scope.eventName = tempVal;

			tempVal = getCookie("logoImageUrl");
			if (tempVal != undefined) {
				get('hidden-image-url').value = tempVal;
				$scope.image = tempVal;
				$scope.dummyFileName = tempVal.split("--")[1];
			}

			tempVal = getCookie("dateStarts");
			if (tempVal != undefined) $scope.dateStarts = tempVal;

			tempVal = getCookie("timeStarts");
			if (tempVal != undefined) $scope.onTimeStartsSelected(tempVal);

			tempVal = getCookie("dateEnds");
			if (tempVal != undefined) $scope.dateEnds = tempVal;

			tempVal = getCookie("timeEnds");
			if (tempVal != undefined) $scope.onTimeEndsSelected(tempVal);

			tempVal = getCookie("recurrence");
			if (tempVal != undefined) $scope.onRecurrenceSelected(tempVal);

			tempVal = getCookie("size");
			if (tempVal != undefined) $scope.onSizeSelected(tempVal);

			tempVal = getCookie("gender");
			if (tempVal != undefined) $scope.onGenderSelected(tempVal);

			tempVal = getCookie("description");
			if (tempVal != undefined) $scope.description = tempVal;

			tempVal = getCookie("address1");
			if (tempVal != undefined) $scope.address1 = tempVal;

			tempVal = getCookie("address2");
			if (tempVal != undefined) $scope.address2 = tempVal;

			tempVal = getCookie("cbCapital");
			if (tempVal != undefined && tempVal === "true") $scope.onCapitalClick();

			tempVal = getCookie("cbDiscounts");
			if (tempVal != undefined && tempVal === "true") $scope.onDiscountsClick();

			tempVal = getCookie("cbMerchandise");
			if (tempVal != undefined && tempVal === "true") $scope.onMerchandiseClick();

			tempVal = getCookie("totalAmount");
			if (tempVal != undefined) $scope.totalAmount = tempVal;

			tempVal = getCookie("minAmount");
			if (tempVal != undefined) $scope.minAmount = tempVal;

			tempVal = getCookie("sponsorshipRequests");
			if (tempVal != undefined) $scope.sponsorshipRequests = tempVal;

			tempVal = getCookie("age1220");
			if (tempVal != undefined && tempVal === "true") $scope.on12_20Click();

			tempVal = getCookie("age2135");
			if (tempVal != undefined && tempVal === "true") $scope.on21_35Click();

			tempVal = getCookie("age3650");
			if (tempVal != undefined && tempVal === "true") $scope.on36_50Click();

			tempVal = getCookie("age51");
			if (tempVal != undefined && tempVal === "true") $scope.on51Click();

			tempVal = getCookie("incomeLow");
			if (tempVal != undefined && tempVal === "true") $scope.onIncomeLowClick();

			tempVal = getCookie("incomeMed");
			if (tempVal != undefined && tempVal === "true") $scope.onIncomeMedClick();

			tempVal = getCookie("incomeHigh");
			if (tempVal != undefined && tempVal === "true") $scope.onIncomeHighClick();
    	}

    	tempVal = getCookie("questionsSectionNumber");
		if (tempVal != undefined) $scope.questionsSectionNumber = parseInt(tempVal);

		$scope.$apply();
		deleteCookie("type");
	});

	$scope.image = "/assets/no-image.JPG";

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

			putPartialFormDataIntoCookie();

			formElement.submit();
		}
    });

    $(window).on('beforeunload', function(){
    	if (getCookie("type") != "partial") putAllFormDataIntoCookie();
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
			}; })(img);

			reader.readAsDataURL(imageFile);
    	}
    }, false);

    // upload logo
    $(function() {
    	var logoBorderElement = $("#logo-image-border");
		var progressBar  = $("<div class='bar-a'></div>");
		var barContainer = $("<div class='progress-a'></div>").append(progressBar);
		logoBorderElement.before(barContainer);

		var submitButtonElement = $("#btn-sbmt-event");

		var fileInputElement = $("#file-input");
		fileInputElement.fileupload({
			fileInput: fileInputElement,
			url: $attrs.awsUrl,
			type: 'POST',
			autoUpload: true,
			formData: JSON.parse($attrs.awsFields),
			paramName: 'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
			dataType: 'XML',  // S3 returns XML if success_action_status is set to 201
			replaceFileInput: false,
			disableImageResize: /Android(?!.*Chrome)|Opera/
				.test(window.navigator && navigator.userAgent),
			imageMaxWidth: 300,
			imageMaxHeight: 300,
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				progressBar.css('width', progress + '%');
			},
			start: function (e) {
				submitButtonElement.prop('disabled', true);

				progressBar.
					css('background', 'green').
					css('display', 'block').
					css('width', '0%');
			},
			done: function(e, data) {
				submitButtonElement.prop('disabled', false);

				// extract key and generate URL from response
				var key = $(data.jqXHR.responseXML).find("Key").text();
				var url = $attrs.awsHost + '/' + key;

				// update hidden field
				get("hidden-image-url").value = url;
			},
			fail: function(e, data) {
				submitButtonElement.prop('disabled', false);

				progressBar.
					css("background", "red");
			}
		});
	});

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
		$scope.dateStarts = $scope.dateEnds = getFormattedDate($scope.dateStarts, false);
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
		$scope.cbMerchandise = !$scope.cbMerchandise;
	}

	$scope.onDiscountsClick = function() {
		var element = get('cb-discounts');
		element.checked = !element.checked;
		$scope.cbDiscounts = !$scope.cbDiscounts;
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
		$scope.age1220 = !$scope.age1220;
	}

	$scope.on21_35Click = function() {
		var element = get('cb-21-35');
		element.checked = !element.checked;
		$scope.age2135 = !$scope.age2135;
	}

	$scope.on36_50Click = function() {
		var element = get('cb-36-50');
		element.checked = !element.checked;
		$scope.age3650 = !$scope.age3650;
	}

	$scope.on51Click = function() {
		var element = get('cb-51');
		element.checked = !element.checked;
		$scope.age51 = !$scope.age51;
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
		$scope.incomeLow = !$scope.incomeLow;
	}

	$scope.onIncomeMedClick = function() {
		var element = get('cb-income-med');
		element.checked = !element.checked;
		$scope.incomeMed = !$scope.incomeMed;
	}

	$scope.onIncomeHighClick = function() {
		var element = get('cb-income-high');
		element.checked = !element.checked;
		$scope.incomeHigh = !$scope.incomeHigh;
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
					if (parseInt(value) <= parseInt(scope.totalAmount.replace(/,/g, "")))
						isValid = true;

					ctrl.$setValidity('invalidMinAmount', isValid);
				}

				return isValid ? value : undefined;
			}

			ctrl.$parsers.unshift(validate);
		}
	}
});



