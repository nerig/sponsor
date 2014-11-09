// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require_tree ./public
//= require_tree .


var log = function(str) {
	console.log(str);
}

var get = function(id) {
	return document.getElementById(id);
}

var getStyle = function (el, styleProp)
{
	if (el.currentStyle)
		var y = el.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	return y;
}

// calculating correct minimum hight of general-div so the 
// footer will always be at the bottom of the screen when 
// there is not enough content
window.onload = function() {
	var footerHeight = getStyle(get('footer'), 'height');
	var headerHeight = getStyle(get('app-header'), 'height');

	var generalDivMinHeight = window.screen.availHeight - parseInt(headerHeight) - parseInt(footerHeight) - 29;

	get('general-div').style.minHeight = generalDivMinHeight + 'px';
}