"use strict";

var compare = function(a, b) {
	return (a > b) ? 1 : ((b > a) ? -1 : 0);
}

var getStreetAddress = function(event, isForMap) {
	var address = event.address1 ? event.address1 : '';
	if (isForMap) return address;

	return address + 
		(event.address2 ? ' ' + event.address2 : '');
}

var getCityAndRest = function(event) {
	var city = '';
	if (event.city) {
		city = event.city;
	}
	var cityAndRegion = '';
	if (event.region) {
		if (city != '') {
			cityAndRegion = city + ', ' + event.region;
		} else {
			cityAndRegion = event.region;
		}
	} else {
		cityAndRegion += city;
	}
	var cityRegionAndCountry = '';
	if (event.country) {
		if (cityAndRegion != '') {
			cityRegionAndCountry = cityAndRegion + ', ' + event.country;
		} else {
			cityRegionAndCountry = event.country;
		}
	} else {
		cityRegionAndCountry += cityAndRegion;
	}

	return cityRegionAndCountry;
}

var getFullAddress = function(event, isForMap) {
	var streetAddress = getStreetAddress(event, isForMap);

	var address = '';
	if (streetAddress != '') {
		address += streetAddress;
	}

	var cityAndRest = getCityAndRest(event);
	if (cityAndRest != '') {
		address += ', ' + cityAndRest;
	}

	return address;
}

angular.module('spons').controller('EventsListCtrl', ["$scope", "$attrs", function($scope, $attrs) {
	
	$scope.myEvents = false;
	if (window.location.hash.length > 0) {
		if (window.location.hash === '#my-events' && $attrs.userId !== "-1") {
			$scope.myEvents = true;
			$scope.events = JSON.parse($attrs.userEvents);
		} else {
			window.location = "/events"
		}
	}
	
	if (!$scope.myEvents) {
		$scope.events = JSON.parse($attrs.events);
	}

	$(window).on('hashchange', function() {
		window.location.reload();
	});
	
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

	$scope.fromDate = 'From'
	$scope.toDate = 'To'

	$scope.isCollapsed = true;

	$scope.go = go;

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
		
		if (!fromDate || '' === fromDate || 'From' === fromDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (fromDate.getTime() <= new Date(element.date_time_starts).getTime());
		});
	};	
})

.filter('toDateFilter', function() {
	return function(events, toDate) {
		
		if (!toDate || '' === toDate || 'To' === toDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			//					adding a day to capture events ending on the same filtered day
			return (toDate.getTime() + 86400000 >= new Date(element.date_time_ends).getTime());
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
	
	if (window.location.hash === '#my-events') {
		$scope.minDateFrom = null;
	} else {
		$scope.minDateFrom = $scope.minDateFrom ? null : new Date();
	}
	$scope.minDateTo = $scope.minDateTo ? null : new Date();

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

		$scope.minDateTo = ($scope.$parent.fromDate === 'From') ? new Date() : $scope.$parent.fromDate;
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

.controller('SimilarEventsCtrl', ["$scope", "$attrs", "$sanitize",  function ($scope, $attrs, $sanitize) {
	$scope.events = JSON.parse($attrs.events);

	$scope.go = go;

	$scope.getSimilarInText = function(similarInArray) {
		return $sanitize(similarInArray.join(", "));
	}
}]);