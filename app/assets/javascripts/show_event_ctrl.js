angular.module('spons').controller('ShowEventCtrl', ["$scope", "$filter", "$attrs", "$sanitize", function ($scope, $filter, $attrs, $sanitize) {
	
	/* contains calculation of various elements of the events show page,
	including lenght of description in case the description gets to be 
	lower than the image, sponsor! button location, selection of glyphicons
	for sponsorship types... */

	/* description length and description position calculations */
	var descriptionMaxHeight = 60;

	var descriptionElement = get('ev-desc');
	var tmpTrimmedText = descriptionElement.innerHTML;
	var trimmedText = descriptionElement.innerHTML;
	$scope.restOfText = '';
	
	$scope.originalDescription = descriptionElement.innerHTML;
	if (descriptionElement.offsetHeight > descriptionMaxHeight) {
		while (descriptionElement.offsetHeight > descriptionMaxHeight) {
			var lastSpace = tmpTrimmedText.lastIndexOf(" ");
			var lastLineBreak = tmpTrimmedText.lastIndexOf("<br />");
			var lastBreak = Math.max(lastLineBreak, lastSpace);
			
			tmpTrimmedText = $scope.originalDescription.substring(0, lastBreak);
			trimmedText = tmpTrimmedText + '<span id="three-dots">...</span>';
			
			$scope.restOfText = $scope.originalDescription.substring(tmpTrimmedText.length, $scope.originalDescription.length);
			
			descriptionElement.innerHTML = trimmedText;
		}
	} else {
		/* not showing read more if there is no overflow */
		get('read-more').style.visibility = "hidden";
	}

	if ($scope.restOfText.indexOf("<br />") === 0) {
		// removing break if the rest of text starts with it so to not have two newlines instead of one
		$scope.restOfText = $scope.restOfText.replace("<br />", "");
	}
	if (descriptionElement.innerHTML.indexOf('<br /><span id="three-dots">...</span>') != -1) {
		// last line of the beginning of the description we show at start is practiacally
		// just '...'. it doesn't look so nice
		descriptionElement.innerHTML = descriptionElement.innerHTML.replace('<br /><span id="three-dots">...</span>', '<span id="three-dots">...</span>');
		$scope.restOfText = "<br />" + $scope.restOfText;
	}

	// replace all links in the description with actual links
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
	descriptionElement.innerHTML = replaceUrl(descriptionElement.innerHTML);
	$scope.restOfText = replaceUrl($scope.restOfText);

	// put sponsor button and event details in a nice location
	var sponsorButtonElement = get('event-sponsor-button');
	if (window.innerWidth > 1024) {
		var logoHeight = get('logo-space').offsetHeight;

		// above-the-description elements location calculation
		var aboveTheDescriptionElement = get('above-the-description');
		aboveTheDescriptionElement.style.marginTop = ((logoHeight / 2) - (aboveTheDescriptionElement.offsetHeight / 2)) + 'px';

		/* sponsor! button location calculation */
		sponsorButtonElement.style.marginTop = ((logoHeight / 2) - (sponsorButtonElement.offsetHeight / 2)) + 'px';
	} else {
		sponsorButtonElement.style.marginTop = "2em";
	}

	/* show requested sponsorship types */
	var event = JSON.parse($attrs.event);
	angular.forEach(event.sponsorship_types, function(type) {
		get(type).style.display = "inherit";
	});

	$scope.streetAddress = $sanitize(getStreetAddress(event));
	$scope.cityAndRest = $sanitize(getCityAndRest(event));
	$scope.fullAddress = $sanitize(getFullAddress(event));
	
	// event dates range
	var startDate = new Date(event.date_time_starts);
	var endDate = new Date(event.date_time_ends);
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
					zoom: 17,
					center: results[0].geometry.location,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scrollwheel: false
				}
				var map = new google.maps.Map(get("map_canvas"), mapOptions);

				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					title: event.name
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
	event.age_ranges.sort();
	for (var i = 0; i < event.age_ranges.length; i++) {
		if (!$scope.ageRanges) {
			$scope.ageRanges = event.age_ranges[i];
			continue;
		}

		var splitRange = event.age_ranges[i].split("-");
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
			$scope.ageRanges += ',' + event.age_ranges[i];
		}
	}
	$scope.ageRanges = $sanitize($scope.ageRanges);

	var threeDotsElement = get('three-dots');
	$scope.toggleFullDescription = function() {
		$scope.showingEntireDescription = !$scope.showingEntireDescription;
		threeDotsElement.style.visibility = $scope.showingEntireDescription ? "hidden" : "visible";
	}
}]);