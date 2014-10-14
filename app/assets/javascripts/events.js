"use strict";

var spons = angular.module('spons', ['multi-select', 'ui.bootstrap']);

var compare = function(a, b) {
	return (a > b) ? 1 : ((b > a) ? -1 : 0);
}

var log = function(str) {
	console.log(str);
}

var get = function(id) {
	return document.getElementById(id);
}

spons.controller('EventsListCtrl', ["$scope", function($scope) {
	
	$scope.initWith = function(events) {
		$scope.events = JSON.parse(events);
		//console.log($scope.events);
		
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
			if (tempValues.indexOf(event.age_range) === -1) {
				$scope.ageRanges.push({"range": event.age_range});
				tempValues.push(event.age_range);
			}
			if (tempValues.indexOf(event.size_range) === -1) {
				$scope.sizeRanges.push({"range": event.size_range});
				tempValues.push(event.size_range);
			}
		});
		$scope.locations.sort(function(a, b) { return compare(a.city, b.city); });
		//console.log($scope.locations);
		$scope.ageRanges.sort(function(a, b) { return compare(a.range, b.range); });
		//console.log($scope.ageRanges);
		$scope.sizeRanges.sort(function(a, b) { return compare(parseInt(a.range), parseInt(b.range)); });
		//console.log($scope.sizeRanges);

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
			return (flatRanges.indexOf(element.age_range) >= 0);
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
			return (flatIncomes.indexOf(element.attendees_income_level) >= 0);
		});
	};	
})

.filter('fromDateFilter', function() {
	return function(events, fromDate) {
		
		if (!fromDate || '' === fromDate || 'From, today' === fromDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (fromDate.getTime() <= element.date_time);
		});
	};	
})

.filter('toDateFilter', function() {
	return function(events, toDate) {
		
		if (!toDate || '' === toDate || 'To, eternity' === toDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (toDate.getTime() >= element.date_time);
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
		//console.log($scope.$parent.genderFilterSelection);
		$scope.status.buttonText = choice;
		$scope.$parent.genderFilterSelection = choice;
		//console.log($scope.$parent.genderFilterSelection);
	}
}])

.controller('ShowEventCtrl', ["$scope", function ($scope) {
		
	/* contains calculation of lenght of description to show,
	in case the description gets to be lower that the image */
	var logoHeight = get('event-logo').offsetHeight;
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
			trimmedText = tmpTrimmedText + '<span id="three-Dots">...</span>';
			$scope.restOfText = $scope.originalDescription.substring(tmpTrimmedText.length, $scope.originalDescription.length);

			descriptionElement.innerHTML = trimmedText;
		}

		/* calculate gap between trimmed description to read more
		so to place the rest of the text correctly when needed */
		var logoBottom = $('#event-logo').offset().top + logoHeight;
		var descriptionBottom = $('#ev-desc').offset().top + descriptionElement.offsetHeight;
		var lower = Math.max(logoBottom, descriptionBottom);

		/* getting negative number of pixels to offset the rest of description */
		var restOfTextPosition = lower - $('#rest-of-description').offset().top;
		
		var restOfDescElement = get('rest-of-description');
		descriptionElement.style.marginTop  = -restOfTextPosition + 'px';
		restOfDescElement.style.marginTop  = restOfTextPosition + 'px';

	} else {
		/* not showing read more if there is no overflow */
		get('read-more').style.visibility = "hidden";
	}

	$scope.toggleFullDescription = function() {
		$scope.showRestOfDescription = !$scope.showRestOfDescription;
		get('three-Dots').style.visibility = $scope.showRestOfDescription ? "hidden" : "visible";
	}
}]);