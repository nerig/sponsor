"use strict";

var compare = function(a, b) {
	return (a > b) ? 1 : ((b > a) ? -1 : 0);
}

var getFullAddress = function(event) {
	var streetAddress = (event.address1 ? event.address1 : '') + 
		(event.address2 ? ' ' + event.address2 : '');
	var streetAndCity = '';
	if (event.city) {
		if (streetAddress != '') {
			streetAndCity = streetAddress + ', ' + event.city;
		} else {
			streetAndCity = event.city;
		}
	} else {
		streetAndCity += streetAddress;
	}
	var streetCityAndRegion = '';
	if (event.region) {
		if (streetAndCity != '') {
			streetCityAndRegion = streetAndCity + ', ' + event.region;
		} else {
			streetCityAndRegion = event.region;
		}
	} else {
		streetCityAndRegion += streetAndCity;
	}
	var streetCityRegionAndCountry = '';
	if (event.country) {
		if (streetCityAndRegion != '') {
			streetCityRegionAndCountry = streetCityAndRegion + ', ' + event.country;
		} else {
			streetCityRegionAndCountry = event.country;
		}
	} else {
		streetCityRegionAndCountry += streetCityAndRegion;
	}

	return streetCityRegionAndCountry;
}

var spons = angular.module('spons', ['multi-select', 'ui.bootstrap', 'ngSanitize']);

spons.controller('EventsListCtrl', ["$scope", function($scope) {
	
	$scope.initWith = function(events) {
		$scope.events = JSON.parse(events.replace(/\r\n/g, "\\r\\n"));
		
		// extracting the lists of filters from existing values in the events
		$scope.locations = [];
		$scope.ageRanges = [];
		$scope.sizeRanges = [];
		var tempValues = []; // helps determining whether a value is already in the list
		angular.forEach($scope.events, function(event) {
			if (tempValues.indexOf(event.city) === -1) {
				$scope.locations.push({"city": event.city});
				tempValues.push(event.city);
			}
			angular.forEach(event.age_ranges, function(oneRange) {
				if (tempValues.indexOf(oneRange) === -1) {
					$scope.ageRanges.push({"range": oneRange});
					tempValues.push(oneRange);
				}
			});
			if (tempValues.indexOf(event.size_range) === -1) {
				$scope.sizeRanges.push({"range": event.size_range});
				tempValues.push(event.size_range);
			}
		});
		$scope.locations.sort(function(a, b) { return compare(a.city, b.city); });
		$scope.ageRanges.sort(function(a, b) { return compare(a.range, b.range); });
		$scope.sizeRanges.sort(function(a, b) { return compare(parseInt(a.range), parseInt(b.range)); });

		$scope.incomeLevels = [{"income": "Low"}, {"income": "Medium"}, {"income": "High"}];

		$scope.genderFilterSelection = 'Both';

		$scope.fromDate = 'From, today'
		$scope.toDate = 'To, eternity'

		$scope.isCollapsed = true;
	}

	$scope.go = function(path) {
		window.location.href = path;
	}

	$scope.toggleHiddenFilters = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
	}

	$scope.fullAddress = getFullAddress;
}])

.filter('locationFilter', function() {
	return function(events, locations) {
		if (!locations || '' === locations || 0 === locations.length) {
			return events;
		}
		
		var flatLocations = [];
		angular.forEach(locations, function(location) {
			flatLocations.push(location.city);
		});
		
		if (flatLocations.length === 0) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (flatLocations.indexOf(element.city) >= 0);
		});
	};
})

.filter('ageFilter', function() {
	return function(events, ageRanges) {
		
		if (!ageRanges || '' === ageRanges || 0 === ageRanges.length) {
			return events;
		}

		var flatRanges = [];
		angular.forEach(ageRanges, function(range) {
			flatRanges.push(range.range);
		});

		if (flatRanges.length === 0) {
			return events;
		}

		return events.filter(function(element, index, array) {
			var found = false;
			angular.forEach(element.age_ranges, function(range) {
				if (flatRanges.indexOf(range) >= 0) found = true;
			});
			return found;
		});
	};	
})

.filter('sizeFilter', function() {
	return function(events, sizeRanges) {
		
		if (!sizeRanges || '' === sizeRanges || 0 === sizeRanges.length) {
			return events;
		}

		var flatRanges = [];
		angular.forEach(sizeRanges, function(range) {
			flatRanges.push(range.range);
		});

		if (flatRanges.length === 0) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (flatRanges.indexOf(element.size_range) >= 0)
		});
	};	
})

.filter('incomeFilter', function() {
	return function(events, incomeSelections) {
		
		if (!incomeSelections || '' === incomeSelections || 0 === incomeSelections.length) {
			return events;
		}

		var flatIncomes = [];
		angular.forEach(incomeSelections, function(income) {
			flatIncomes.push(income.income);
		});

		if (flatIncomes.length === 0) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			var found = false;
			angular.forEach(element.attendees_income_levels, function(level) {
				if (flatIncomes.indexOf(level) >= 0) found = true;
			});
			return found;
		});
	};	
})

.filter('fromDateFilter', function() {
	return function(events, fromDate) {
		
		if (!fromDate || '' === fromDate || 'From, today' === fromDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (fromDate.getTime() <= new Date(element.date_time).getTime());
		});
	};	
})

.filter('toDateFilter', function() {
	return function(events, toDate) {
		
		if (!toDate || '' === toDate || 'To, eternity' === toDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (toDate.getTime() >= new Date(element.date_time).getTime());
		});
	};	
})

.filter('genderFilter', function() {
	return function(events, genderSelection) {
		
		if (!genderSelection || '' === genderSelection || 'Both' === genderSelection) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (genderSelection === element.attendees_gender);
		});
	};	
})

.controller('DatepickerCtrl', ["$scope", function ($scope) {
	
	$scope.toggleMin = function() {
		$scope.minDateFrom = $scope.minDateFrom ? null : new Date();
		$scope.minDateTo = $scope.minDateTo ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event, what) {
		$event.preventDefault();
		$event.stopPropagation();

		if (what === 'from') {
			$scope.opened1 = !$scope.opened1;
			$scope.opened2 = false;
		} else {
			$scope.opened1 = false;
			$scope.opened2 = !$scope.opened2;
		}

		$scope.minDateTo = ($scope.$parent.fromDate === 'From, today') ? new Date() : $scope.$parent.fromDate;
	};

	$scope.dateOptions = {
		startingDay: 1,
		showWeeks: false
	};
}])

.controller('DropdownCtrl', ["$scope", function ($scope) {
	$scope.items = [
		'Both',
		'Female',
		'Male'
	];

	$scope.status = {
		isopen: false,
		buttonText: "Any gender"
	};

	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};

	$scope.genderChanged = function(choice) {
		$scope.status.buttonText = choice;
		$scope.$parent.genderFilterSelection = choice;
	}
}])

.controller('ShowEventCtrl', ["$scope", function ($scope) {
		
	$scope.initWith = function(crudeEvent) {
		/* contains calculation of various elements of the events show page,
		including lenght of description in case the description gets to be 
		lower than the image, sponsor! button location, selection of glyphicons
		for sponsorship types... */
		
		/* description length and position calculations */
		var logoElement = get('event-logo');
		var logoHeight = logoElement.offsetHeight;
		var detailsAboveTheDescriptionHeight = get('above-the-description').offsetHeight;

		var descriptionMaxHeight = logoHeight - detailsAboveTheDescriptionHeight;

		if (descriptionMaxHeight < 20) {
			descriptionMaxHeight = 20;
		}

		var descriptionElement = get('ev-desc');
		var tmpTrimmedText = descriptionElement.innerHTML;
		var trimmedText = descriptionElement.innerHTML;
		$scope.restOfText = '';
		
		$scope.originalDescription = descriptionElement.innerHTML;
		if (descriptionElement.offsetHeight > descriptionMaxHeight) {
			while (descriptionElement.offsetHeight > descriptionMaxHeight) {
				var lastSpace = tmpTrimmedText.lastIndexOf(" ");
				tmpTrimmedText = $scope.originalDescription.substring(0, lastSpace);
				trimmedText = tmpTrimmedText + '<span id="three-dots">...</span>';
				$scope.restOfText = $scope.originalDescription.substring(tmpTrimmedText.length, $scope.originalDescription.length);

				descriptionElement.innerHTML = trimmedText;
			}

			/* calculate gap between trimmed description to the rest of it
			so to place the rest of the text correctly when needed */
			var logoBottom = $('#event-logo').offset().top + logoHeight;
			var descriptionBottom = $('#ev-desc').offset().top + descriptionElement.offsetHeight;
			var lower = Math.max(logoBottom, descriptionBottom);

			/* getting negative number of pixels to offset the rest of description */
			var restOfTextPosition = lower - $('#rest-of-description').offset().top;
			var restOfDescElement = get('rest-of-description');
			restOfDescElement.style.marginTop  = restOfTextPosition + 'px';

			/* now if the image is lower than the description we want the description
			   to end at the same line */

			var descriptionOffset = 0;
			if (logoBottom > descriptionBottom) {
				descriptionOffset = logoBottom - descriptionBottom;
				descriptionElement.style.marginTop  = descriptionOffset + 'px';

				get('read-more').style.marginTop = '0px';
			}
			

		} else {
			/* not showing read more if there is no overflow */
			get('read-more').style.visibility = "hidden";
		}

		/* sponsor! button location calculation */
		var sponsorButtonElement = get('event-sponsor-button');
		sponsorButtonElement.style.marginTop = ((logoHeight / 2) - (sponsorButtonElement.offsetHeight / 2)) + 'px';

		/* glyphicons selections logic for sponsorship types */
		crudeEvent = crudeEvent.replace(/\r\n/g, "\\r\\n");
		var event = JSON.parse(crudeEvent);
		angular.forEach(event.sponsorship_types, function(type) {
			get(type).style.display = "inherit";
		});

		$scope.fullAddress = getFullAddress(event);

		/* get the map */
		var mapInit = function() {
			var geocoder = new google.maps.Geocoder();
			log($scope.fullAddress);
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

		$scope.toggleFullDescription = function() {
			$scope.showRestOfDescription = !$scope.showRestOfDescription;
			get('three-dots').style.visibility = $scope.showRestOfDescription ? "hidden" : "visible";
		}
	}
}]);