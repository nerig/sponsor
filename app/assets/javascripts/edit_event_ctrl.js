"use strict";

angular.module('spons').controller('editEventFormCtrl', ["$scope", "$attrs", function($scope, $attrs) {
	$scope.eventToEdit = JSON.parse($attrs.event);
}]);