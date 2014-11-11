"use strict";

spons.controller('newSponsorshipResponseFormCtrl', ["$scope", function($scope) {
    
    $scope.initWith = function(eventi) {

        var event = JSON.parse(eventi.replace(/\r\n/g, "\\r\\n"));

        var handler = StripeCheckout.configure({
            key: 'pk_test_ivj8TLBMdtxp3dek1oI5Szny',
            image: 'https://www.callfire.com/sites/default/files/blog/images/advertising.jpg',
            token: function(token) {
                var formElement = $('#sponsor-form');
                formElement.append($('<input type="hidden" name="response[payment_token]" />').val(token.id));
                formElement.get(0).submit(); // get(0) is needed because calling submit on the jQuery object will cause an infinite loop. see https://stripe.com/docs/tutorials/forms
            }
        });

        get('btn-sbmt-sponsor').addEventListener('click', function(e) {
            // Open Checkout with further options
            handler.open({
                name: 'You are sponsoring:',
                description: event.name,
                panelLabel: "Sponsor {{amount}}",
                allowRememberMe: false,
                zipCode: true,
                amount: $scope.amount * 100
            });
            e.preventDefault();
        });
    }
}]);