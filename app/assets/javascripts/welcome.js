"use strict";

spons.controller('EntireHomepageCtrl', ["$scope", function($scope) {
	
	var makeEventsVisible = function() {
		$scope.showInitialHomepage = false;
		
		// make events list visible
		var listElement = get('events-list');
		listElement.style.opacity = 1;
		listElement.style.height = "auto";
		listElement.style.overflow = "visible";

		get('free-text-search').focus();
	}

	$scope.showInitialHomepage = true;
	get('homepage-search').focus();

	if (window.location.hash.length > 0) {
		if (window.location.hash === '#events') {
			makeEventsVisible();
		}
	}
	
	$scope.onTextChange = function() {
		window.location.hash = 'events';
		makeEventsVisible();
	}

	window.onhashchange = function() {		
		// supporting back from any page or hash to the homepage
		if (window.location.hash === '') {
			window.location.reload();
		}
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