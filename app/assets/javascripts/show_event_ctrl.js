angular.module('spons').controller('ShowEventCtrl', ["$scope", "$filter", "$attrs", "$sanitize", function ($scope, $filter, $attrs, $sanitize) {
	
	$scope.myEvent = $attrs.myEvent === 'true';

	/* contains calculation of various elements of the events show page,
	including lenght of description in case the description gets to be 
	lower than the image, sponsor! button location, selection of glyphicons
	for sponsorship types... */

	$scope.event = JSON.parse($attrs.event);

	/* description length and description position calculations */

	// replace all links in a string with actual links
	var replaceUrl = function(str) {
		var regx = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.#!-]*)*\/?[^. <>]/ig;
		return str.replace(regx, 
			function(link) {
				if (link.slice(0, "http".length) === "http") {
					return '<a target="_blank" href="' + link + '">' + link + '</a>';
				} else {
					return '<a target="_blank" href="//' + link + '">' + link + '</a>';
				}
		});
	}

	windowOnLoad(function() {
		var tmpTrimmedText = $scope.beginningOfText = $scope.event.description;

		$scope.$apply();

		var descriptionElement = get('ev-desc');
		var descriptionMaxHeight = 60;
		
		$scope.restOfText = '';

		var threeDotsNeeded = true;

		if (descriptionElement.offsetHeight > descriptionMaxHeight) {
			while (descriptionElement.offsetHeight > descriptionMaxHeight) {
				var lastSpace = tmpTrimmedText.lastIndexOf(" ");
				var lastLineBreak = tmpTrimmedText.lastIndexOf("<br/>");
				var lastBreak = Math.max(lastLineBreak, lastSpace);
				
				tmpTrimmedText = $scope.event.description.substring(0, lastBreak);
				$scope.beginningOfText = tmpTrimmedText + "...";
				$scope.restOfText = $scope.event.description.substring(tmpTrimmedText.length, $scope.event.description.length);

				$scope.$apply();
			}
		} else {
			/* not showing read more if there is no overflow */
			get('read-more').style.visibility = "hidden";
			threeDotsNeeded = false;
		}

		// delete three dots to add them later properly
		if (threeDotsNeeded) {
			$scope.beginningOfText = $scope.beginningOfText.substring(0, $scope.beginningOfText.lastIndexOf("..."));
		}

		if ($scope.restOfText.indexOf("<br/>") === 0) {
			// removing break if the rest of text starts with it so to not have two newlines instead of one
			$scope.restOfText = $scope.restOfText.replace("<br/>", "");
		}
		if ($scope.beginningOfText.lastIndexOf('<br/>') == ($scope.beginningOfText.length - 5)) {
			log("here");
			// last line of the beginning of the description we show at start is practiacally
			// just '...'. it doesn't look so nice
			$scope.beginningOfText = $scope.beginningOfText.substring(0, $scope.beginningOfText.length - 5);
			$scope.restOfText = "<br/>" + $scope.restOfText;
		}

		$scope.beginningOfText = replaceUrl($scope.beginningOfText);
		$scope.restOfText = replaceUrl($scope.restOfText);

		$scope.$apply();

		if (threeDotsNeeded) {
			descriptionElement.innerHTML = descriptionElement.innerHTML + '<span id="three-dots">...</span>';
		}
	});


	// put sponsor button and event details in a nice location
	var sponsorButtonElement = get('event-sponsor-button');
	var editDeleteElement = get('my-event-edit-delete');
	if (window.innerWidth > 1024) {
		var logoHeight = get('logo-space').offsetHeight;

		// above-the-description elements location calculation
		var aboveTheDescriptionElement = get('above-the-description');
		aboveTheDescriptionElement.style.marginTop = ((logoHeight / 2) - (aboveTheDescriptionElement.offsetHeight / 2)) + 'px';

		/* sponsor! button location calculation */
		sponsorButtonElement.style.marginTop = ((logoHeight / 2) - (sponsorButtonElement.offsetHeight / 2)) + 'px';
		editDeleteElement.style.marginTop = ((logoHeight / 2) - (editDeleteElement.offsetHeight / 2)) + 'px';
	} else {
		sponsorButtonElement.style.marginTop = "2em";
		editDeleteElement.style.marginTop = "2em";
	}

	/* show requested sponsorship types */
	angular.forEach($scope.event.sponsorship_types, function(type) {
		get(type).style.display = "inherit";
	});

	$scope.streetAddress = $sanitize(getStreetAddress($scope.event));
	$scope.cityAndRest = $sanitize(getCityAndRest($scope.event));
	$scope.fullAddress = $sanitize(getFullAddress($scope.event));
	
	// event dates range
	var startDate = new Date($scope.event.date_time_starts);
	var endDate = new Date($scope.event.date_time_ends);
	$scope.dateRangeString = $filter('date')(startDate,'EEEE, MMMM d, y, h:mm a', 'UTC') + ' - ';
	$scope.dateRangeString += (startDate.toDateString() === endDate.toDateString()) ?
		$filter('date')(endDate, 'h:mm a', 'UTC') :
		$filter('date')(endDate, 'EEEE, MMMM d, y, h:mm a', 'UTC');
	$scope.dateRangeString = $sanitize($scope.dateRangeString);

	/* get the map */
	var mapInit = function() {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': $scope.fullAddress }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var mapOptions = {
					zoom: 14,
					center: results[0].geometry.location,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scrollwheel: true
				}
				var map = new google.maps.Map(get("map_canvas"), mapOptions);

				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					title: $scope.event.name
				});
			} else {
				log('could not find address for showing in google maps');
				log('results: ' + results);
				log('status: ' + status);
			}
		});
	}
	/* load the map when page is done loading */
	google.maps.event.addDomListener(window, 'load', mapInit);

	/* make age range readable */
	$scope.event.age_ranges.sort();
	for (var i = 0; i < $scope.event.age_ranges.length; i++) {
		if (!$scope.ageRanges) {
			$scope.ageRanges = $scope.event.age_ranges[i];
			continue;
		}

		var splitRange = $scope.event.age_ranges[i].split("-");
		var bigger = parseInt(splitRange[0]);

		var splitScope = $scope.ageRanges.split("-");
		var smallerStr = splitScope[splitScope.length - 1];
		var smaller = parseInt(smallerStr);

		if ((bigger - smaller) == 1) {
			if (bigger == 51) {
				$scope.ageRanges = $scope.ageRanges.replace('-' + smallerStr, '+');
			} else {
				$scope.ageRanges = $scope.ageRanges.replace(smallerStr, splitRange[1]);
			}
		} else {
			$scope.ageRanges += ',' + $scope.event.age_ranges[i];
		}
	}
	$scope.ageRanges = $sanitize($scope.ageRanges);

	$scope.toggleFullDescription = function() {
		var threeDotsElement = get('three-dots');
		$scope.showingEntireDescription = !$scope.showingEntireDescription;
		threeDotsElement.style.visibility = $scope.showingEntireDescription ? "hidden" : "visible";
	}
}]);