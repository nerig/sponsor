"use strict";

spons.controller('EntireHomepageCtrl', ["$scope", function($scope) {
	
	$scope.showInitialHomepage = true;
	get('homepage-search').focus();

	$scope.onTextChange = function() {
		$scope.showInitialHomepage = false;
		
		// make events list visible
		var listElement = get('events-list');
		listElement.style.opacity = 1;
		listElement.style.height = "auto";
		listElement.style.overflowY = "visible";

		get('free-text-search').focus();
	}
}])

.controller('HomepageCtrl', ["$scope", function($scope) {
	$scope.initWith =  function(events) {
		$scope.events = JSON.parse(events.replace(/\r\n/g, "\\r\\n"));
	}

	$scope.go = function(path) {
		window.location.href = path;
	}
}]);