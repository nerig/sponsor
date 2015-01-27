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
	var headerHeight = getStyle(get('header'), 'height');

	var generalDivMinHeight = window.screen.availHeight - parseInt(headerHeight) - parseInt(footerHeight) - 29;

	get('general-div').style.minHeight = generalDivMinHeight + 'px';
}

var addValidationsCssRule = function() {
	var sheet = window.document.styleSheets[0];
	if (sheet.insertRule) {
		sheet.insertRule('form .ng-untouched.ng-invalid, form .ng-dirty.ng-invalid, form .ng-touched.ng-invalid { border-color: red; box-shadow: none; }', 
			sheet.cssRules.length);
		sheet.insertRule('form .ng-untouched.ng-invalid:focus, form .ng-dirty.ng-invalid:focus, form .ng-touched.ng-invalid:focus { outline-offset: 0; outline: -webkit-focus-ring-color auto 0px; }', 
			sheet.cssRules.length);
	} else {
		if (sheet.addRule) {
			sheet.addRule('form .ng-untouched.ng-invalid, form .ng-dirty.ng-invalid, form .ng-touched.ng-invalid', 'border-color: red; box-shadow: none;', -1);
			sheet.addRule('form .ng-untouched.ng-invalid:focus, form .ng-dirty.ng-invalid:focus, form .ng-touched.ng-invalid:focus', 'outline-offset: 0; outline: -webkit-focus-ring-color auto 0px;', -1);
		}
	}
}

var go = function(path) {
	window.location.href = path;
}

// saves a cookie for 1 day
var setCookie = function(cname, cvalue, isPermanent) {
	var days = (isPermanent) ? 30 : 0.5;
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return undefined;
}

var deleteCookie = function(cname) {
	var d = new Date();
    d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=; " + expires;
}