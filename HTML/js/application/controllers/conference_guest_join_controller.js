conferenceAppModule.controller('conferenceGuestJoinController', ['$scope', '$http', '$interval', '$location', '$window',
    function ($scope, $http, $interval, $location, $window) {
        $scope.name = "guest join controller";


        $scope.joinConference = function () {
            //#/conference/video

            var conference_guest = {
                name: $scope.guest.name
            };
            sessionStorage.setItem("conference_guest",  angular.toJson(conference_guest));
            $location.path("/conference/video");
        }
    }]);