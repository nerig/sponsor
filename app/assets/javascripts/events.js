"use strict";

var spons = angular.module('spons', ['multi-select']);

var compare = function(a, b) {
	return (a > b) ? 1 : ((b > a) ? -1 : 0);
}

spons.controller('EventsListCtrl', ["$scope", function($scope) {
	
	$scope.initWith = function(events) {
		$scope.events = JSON.parse(events);
		//console.log($scope.events);
		
		// extracting the list of locations
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
		$scope.sizeRanges.sort(function(a, b) { return compare(parseInt(a.range), parseInt(b.range)); })
		//console.log($scope.sizeRanges);

	}

	$scope.go = function(path) {
		window.location.href = path;
	}
}])

.filter('locationFilter', function() {
	return function(events, locations) {
		return events.filter(function(element,index, array) {return true});
		var locations = search.locations;
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
			return (flatLocations.indexOf(element.city) >= 0) ? true : false;
		});
	};
})

.filter('ageFilter', function() {
	return function(events, search) {
		return events.filter(function(element,index, array) {return true});

		if (!search) {
			return events;
		}

		var locations = search.locations;
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
			return (flatLocations.indexOf(element.city) >= 0) ? true : false;
		});
	};	
})

.filter('sizeFilter', function() {
	return function(events, search) {
		return events.filter(function(element,index, array) {return true});

		if (!search) {
			return events;
		}

		var locations = search.locations;
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
			return (flatLocations.indexOf(element.city) >= 0) ? true : false;
		});
	};	
});
