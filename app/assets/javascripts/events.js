
var spons = angular.module('spons', ['multi-select']);

spons.controller('EventsListCtrl', function($scope) {
	
	$scope.init = function(events) {
		$scope.events = JSON.parse(events);
		console.log($scope.events);
	}

})