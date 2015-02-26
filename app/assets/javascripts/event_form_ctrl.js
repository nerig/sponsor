"use strict";

angular.module('spons').controller('newEventFormCtrl', ["$scope", "$attrs", "$filter", function($scope, $attrs, $filter) {
	
	var thisIsAnEditScenario = ($scope.$parent.eventToEdit != undefined);

	var formElement = get('new-event-form');
	formElement.method = "POST";
	if (thisIsAnEditScenario) {
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

	var showOnMapWithCoordinates = function(latlng) {
		var mapOptions = {
			zoom: 13,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: true
		}
		var map = new google.maps.Map(get("map-helper"), mapOptions);
		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			title: ""
		});
	}

	var showOnMapWithFullAddress = function(address) {
		new google.maps.Geocoder().geocode({ 'address': address }, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				showOnMapWithCoordinates(results[0].geometry.location);
			}
		});
	}

	var showOnMapWithScopeAddress = function() {
		showOnMapWithFullAddress(getFullAddress({
			"address1": $scope.address1,
			"address2": $scope.address2,
			"city": $scope.locality,
			"region": $scope.administrative_area_level_1,
			"country": $scope.country
		}));
	}

	var componentForm = {
		locality: 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'long_name',
		postal_code: 'short_name'
	};

	var autocompleteElement = get('autocomplete');
	var autocomplete = new google.maps.places.Autocomplete(autocompleteElement, { types: ['geocode'] });
	
	// When the user selects an address from the dropdown,
	// populate the address fields in the form.
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		// Get the place details from the autocomplete object.
		var place = autocomplete.getPlace();

		if (place.address_components === undefined) {
			showOnMapWithScopeAddress();
			return;
		}

		for (var component in componentForm) {
			get(component).value = '';
		}

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (componentForm[addressType]) {
				var val = place.address_components[i][componentForm[addressType]];
				get(addressType).value = val;
				$scope[addressType] = val;
			}
		}

		setTimeout(function() { // overriding google result
			autocompleteElement.value = place.name;
			$scope.address1 = place.name;
		}, 50);

		// show on the map
		showOnMapWithCoordinates(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
	});

	autocompleteElement.addEventListener('keypress', function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});

	$scope.addressComponentBlurred = function() {
		showOnMapWithScopeAddress();
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
		if ($scope.locality != undefined) setCookie("city", $scope.locality, true);
		if ($scope.administrative_area_level_1 != undefined) setCookie("region", $scope.administrative_area_level_1, true);
		if ($scope.postal_code != undefined) setCookie("zipcode", $scope.postal_code, true);
		if ($scope.country != undefined) setCookie("country", $scope.country, true);

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
			deleteCookie("questionsSectionNumber");
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

	var setPartialFields = function(firstName, lastName, email, phone, city, region, zipcode, country) {
		if (firstName !== undefined) $scope.firstName = firstName;
		if (lastName !== undefined) $scope.lastName = lastName;
		if (email !== undefined) $scope.email = email;
		if (phone !== undefined) $scope.phone = phone;
		if (city !== undefined) $scope.locality = city;
		if (region !== undefined) $scope.administrative_area_level_1 = region;
		if (zipcode !== undefined) $scope.postal_code = zipcode;
		if (country !== undefined) $scope.country = country;		
	}

	var setFields = function(firstName, lastName, email, phone, city, region, zipcode, country,
		eventName, imageUrl, dateStarts, timeStarts, dateEnds, timeEnds, recurrence, size, gender,
		description, address1, address2, cbCapital, cbDiscounts, cbMerchandise, totalAmount, minAmount,
		sponsorshipRequests, age1220, age2135, age3650, age51, incomeLow, incomeMed, incomeHigh) {

		setPartialFields(firstName, lastName, email, phone, city, region, zipcode, country);

		if (eventName !== undefined) $scope.eventName = eventName;

		if (imageUrl !== undefined) {
			get('hidden-image-url').value = imageUrl;
			$scope.image = imageUrl;
			$scope.dummyFileName = imageUrl.split("--")[1];
		}

		if (dateStarts !== undefined) $scope.dateStarts = dateStarts;
		if (timeStarts !== undefined) $scope.onTimeStartsSelected(timeStarts);
		if (dateEnds !== undefined) $scope.dateEnds = dateEnds;
		if (timeEnds !== undefined) $scope.onTimeEndsSelected(timeEnds);
		if (recurrence !== undefined) $scope.onRecurrenceSelected(recurrence);
		if (size !== undefined) $scope.onSizeSelected(size);
		if (gender !== undefined) $scope.onGenderSelected(gender);
		if (description !== undefined) $scope.description = description;
		if (address1 !== undefined) $scope.address1 = address1;
		if (address2 !== undefined) $scope.address2 = address2;

		if (cbCapital !== undefined && cbCapital === "true") $scope.onCapitalClick();
		if (cbDiscounts !== undefined && cbDiscounts === "true") $scope.onDiscountsClick();
		if (cbMerchandise !== undefined && cbMerchandise === "true") $scope.onMerchandiseClick();

		if (totalAmount !== undefined) $scope.totalAmount = totalAmount;
		if (minAmount !== undefined) $scope.minAmount = minAmount;
		if (sponsorshipRequests !== undefined) $scope.sponsorshipRequests = sponsorshipRequests;

		if (age1220 !== undefined && age1220 === "true") $scope.on12_20Click();
		if (age2135 !== undefined && age2135 === "true") $scope.on21_35Click();
		if (age3650 !== undefined && age3650 === "true") $scope.on36_50Click();
		if (age51 !== undefined && age51 === "true") $scope.on51Click();

		if (incomeLow !== undefined && incomeLow === "true") $scope.onIncomeLowClick();
		if (incomeMed !== undefined && incomeMed === "true") $scope.onIncomeMedClick();
		if (incomeHigh !== undefined && incomeHigh === "true") $scope.onIncomeHighClick();
	}

	$(window).on('load', function() {
		var address;
		if (thisIsAnEditScenario) {
			var ev = $scope.$parent.eventToEdit;

			var startDateTime = new Date(ev.date_time_starts);
			var endDateTime = new Date(ev.date_time_ends);

			var startDate = $filter('date')(startDateTime, 'MM/dd/y', 'UTC');
			var startTime = $filter('date')(startDateTime, 'h:mm a', 'UTC');
			var endDate = $filter('date')(endDateTime, 'MM/dd/y', 'UTC');
			var endTime = $filter('date')(endDateTime, 'h:mm a', 'UTC');

			var cbCapital = "false";
			var cbDiscounts = "false";
			var cbMerchandise = "false";
			ev.sponsorship_types.forEach(function(el) {
				if (el === 'capital') cbCapital = "true";
				if (el === 'discounts') cbDiscounts = "true";
				if (el === 'merchandise') cbMerchandise = "true";
			});

			var age1220 = "false";
			var age2135 = "false";
			var age3650 = "false";
			var age51 = "false";
			ev.age_ranges.forEach(function(el) {
				if (el === '12-20') age1220 = "true";
				if (el === '21-35') age2135 = "true";
				if (el === '36-50') age3650 = "true";
				if (el === '51+') age51 = "true";
			});

			var incomeLow = "false";
			var incomeMed = "false";
			var incomeHigh = "false";
			ev.attendees_income_levels.forEach(function(el) {
				if (el === 'low') incomeLow = "true";
				if (el === 'medium') incomeMed = "true";
				if (el === 'high') incomeHigh = "true";
			});

			setFields(ev.first_name, ev.last_name, ev.email, ev.contact_number, ev.city, ev.region, 
				ev.zipcode, ev.country, ev.name, ev.image_url, startDate, startTime, endDate, endTime,
				ev.recurrence, ev.size_range, ev.attendees_gender, ev.description, ev.address1,
				ev.address2, cbCapital, cbDiscounts, cbMerchandise, ev.total_amount, ev.min_amount,
				ev.sponsorship_requests, age1220, age2135, age3650, age51, incomeLow, incomeMed, incomeHigh);

			address = getFullAddress(ev);
		} else {
			if (getCookie("type") === "full") {
				var address1 = getCookie("address1"),
					address2 = getCookie("address2"),
					city = getCookie("city"),
					region = getCookie("region"),
					country = getCookie("country");

				setFields(getCookie("firstName"), getCookie("lastName"), getCookie("email"), 
					getCookie("phone"), city, region, getCookie("zipcode"), country, getCookie("eventName"),
					getCookie("logoImageUrl"), getCookie("dateStarts"), getCookie("timeStarts"),
					getCookie("dateEnds"), getCookie("timeEnds"), getCookie("recurrence"),
					getCookie("size"), getCookie("gender"), getCookie("description"), address1, 
					address2, getCookie("cbCapital"), getCookie("cbDiscounts"), getCookie("cbMerchandise"), 
					getCookie("totalAmount"), getCookie("minAmount"), getCookie("sponsorshipRequests"), 
					getCookie("age1220"),getCookie("age2135"), getCookie("age3650"), getCookie("age51"), 
					getCookie("incomeLow"), getCookie("incomeMed"), getCookie("incomeHigh"));

				address = getFullAddress({
					"address1": address1,
					"address2": address2,
					"city": city,
					"region": region,
					"country": country
				});
			} else {
				setPartialFields(getCookie("firstName"), getCookie("lastName"), getCookie("email"), getCookie("phone"), 
					getCookie("city"), getCookie("region"), getCookie("zipcode"), getCookie("country"));
			}

	    	var tempVal = getCookie("questionsSectionNumber");
			if (tempVal != undefined) $scope.questionsSectionNumber = parseInt(tempVal);

			deleteCookie("type");
		}

		// show on map
		showOnMapWithFullAddress(address);

		$scope.$apply();
	});

	$scope.image = "/assets/no-image.JPG";

	get('btn-sbmt-event').addEventListener('click', function(e) {

		// if form is not valid, submit is not happening
		var signupFormInvalid = false;
		var signupFormExists = false;
		if ($scope.signupForm) {
			signupFormInvalid = $scope.signupForm.$invalid;
			signupFormExists = true;
		}
		
		if ($scope.newEventForm.$invalid || signupFormInvalid) {

			$scope.formIsNotValid = true;

			addValidationsCssRule();
			turnCheckboxesNotificationsOn();
			
			if (!$scope.firstSectionForm.$valid || signupFormInvalid) {
				$scope.onBackClick();
			}

		} else { // submit form
			$scope.formIsNotValid = false;
			$scope.showTypeRequiredNotification = false;
			$scope.showAgesRequiredNotification = false;
			$scope.showIncomesRequiredNotification = false;

			putPartialFormDataIntoCookie();

			if (signupFormExists) {
				$.post("/users", $('#signup-form').serialize())
					.done(function(data) {
						get('hidden-user-id-input').value = data.id;
						formElement.submit();
					});
			} else {
				if ($attrs.userId !== -1) {
					get('hidden-user-id-input').value = $attrs.userId;
					formElement.submit();
				}
			}
		}
    });

    $(window).on('beforeunload', function() {
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
			start: function (e) {
				submitButtonElement.prop('disabled', true);
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
		$scope.country = country;
		showOnMapWithScopeAddress();
	}

	$scope.country = "United States";

	$scope.regionRequired = function() {
		return ($scope.country === "United States");
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
				var isValid = false;
				if (value && scope.totalAmount) {

					if (parseInt(value.replace(/,/g, "")) <= parseInt(scope.totalAmount.replace(/,/g, "")))
						isValid = true;

					ctrl.$setValidity('invalidMinAmount', isValid);
				}

				return isValid ? value : null;
			}

			ctrl.$parsers.unshift(validate);
		}
	}
});



