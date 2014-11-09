"use strict";

spons.controller('ShowSponsorshipResponseCtrl', ["$scope", function($scope) {
    
    $scope.initWith = function(spres, eventi) {

        var sponsorshipResponse = JSON.parse(spres.replace(/\r\n/g, "\\r\\n"));
        var event = JSON.parse(eventi.replace(/\r\n/g, "\\r\\n"));

        var handler = StripeCheckout.configure({
            key: 'pk_test_ivj8TLBMdtxp3dek1oI5Szny',
            image: 'https://www.callfire.com/sites/default/files/blog/images/advertising.jpg',
            token: function(token) {
                // Use the token to create the charge with a server-side script.
                // You can access the token ID with `token.id`
                log('token: ' + token.id);
            }
        });

        get('sponsor-with-payment').addEventListener('click', function(e) {
            // Open Checkout with further options
            handler.open({
                name: 'You are sponsoring:',
                description: event.name,
                amount: $scope.amount * 100
            });
            e.preventDefault();
        })
    }
}]);