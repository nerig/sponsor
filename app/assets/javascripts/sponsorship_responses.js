"use strict";

angular.module('spons').controller('newSponsorshipResponseFormCtrl', ["$scope", "$attrs", "$sanitize", function($scope, $attrs, $sanitize) {

    var handler = StripeCheckout.configure({
        key: 'pk_live_TcfK9gwjaFVT9guYsFkFPkBl',
        image: 'https://www.callfire.com/sites/default/files/blog/images/advertising.jpg',
        token: function(token) {
            var formElement = $('#sponsor-form');
            formElement.append($('<input type="hidden" name="response[payment_token]" />').val(token.id));
            formElement.get(0).submit(); // get(0) is needed because calling submit on the jQuery object will cause an infinite loop. see https://stripe.com/docs/tutorials/forms
        }
    });

    get('btn-sbmt-sponsor').addEventListener('click', function(e) {
        
        e.preventDefault();
        // if form is not valid, payment and submit is not happening
        if ($scope.sponsorForm.$invalid) {
            addValidationsCssRule();
        } else {
            // Open Checkout with further options
            handler.open({
                name: 'You are sponsoring:',
                description: $attrs.eventName,
                panelLabel: $sanitize("Sponsor {{amount}}"),
                allowRememberMe: false,
                zipCode: true,
                amount: $sanitize($scope.amount) * 100
            });
        }
    });
}]);