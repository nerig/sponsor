"use strict";

angular.module('spons').controller('passwordEyeCtrl', [function() {

	$(".glyphicon-eye-open").on("click", function() {
		$(this).toggleClass("glyphicon-eye-close");
		var type = $("#inputPassword").attr("type");
		if (type === "text") {
			$("#inputPassword").attr("type", "password");
		} else {
			$("#inputPassword").attr("type", "text");
		}
	});
}]);
