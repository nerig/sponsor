"use strict";

var spons = angular.module('spons', ['multi-select', 'ui.bootstrap']);

var compare = function(a, b) {
	return (a > b) ? 1 : ((b > a) ? -1 : 0);
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

		$scope.hideMoreFilters = true;

		$scope.genderFilterSelection = 'Both';

		$scope.fromDate = 'From, today'
		$scope.toDate = 'To, eternity'
	}

	$scope.go = function(path) {
		window.location.href = path;
	}

	$scope.toggleHiddenFilters = function() {
		$scope.hideMoreFilters = !$scope.hideMoreFilters;
		//console.log('hideMoreFilters: ' + $scope.hideMoreFilters);
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
			return (fromDate.getTime() <= element.date);
		});
	};	
})

.filter('toDateFilter', function() {
	return function(events, toDate) {
		
		if (!toDate || '' === toDate || 'To, eternity' === toDate) {
			return events;
		}
    
		return events.filter(function(element, index, array) {
			return (toDate.getTime() >= element.date);
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
}]);