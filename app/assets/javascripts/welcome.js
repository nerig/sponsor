"use strict";

spons.controller('EntireHomepageCtrl', ["$scope", "$timeout", function($scope, $timeout) {
	
	var makeEventsVisible = function() {
		$scope.showInitialHomepage = false;
		
		// make events list visible
		var listElement = get('events-list');
		listElement.style.opacity = 1;
		listElement.style.height = "auto";
		listElement.style.overflow = "visible";

		$timeout(function() {
			var ftsElement = get('free-text-search');
			ftsElement.focus();

			// positioning the cursor at the end of the search text
			var val = ftsElement.value;
			ftsElement.value = '';
			ftsElement.value = val;
		})
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

	window.onload = function() {
		var imageHeightWidthRatio = 0.29;
		
		var bigImageElement = get('big-background-image');
		var imageWidth = bigImageElement.offsetWidth;
		var imageHeight = imageWidth * imageHeightWidthRatio;
		
		bigImageElement.style.height = imageHeight + 'px';
	}

}])

.controller('HomepageCtrl', ["$scope", "$attrs", function($scope, $attrs) {
	
	$scope.events = JSON.parse($attrs.events);

	$scope.go = go;
}]);