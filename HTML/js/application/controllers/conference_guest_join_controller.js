conferenceAppModule.controller('conferenceGuestJoinController', ['$scope', '$http', '$interval', '$location', '$window', '$routeParams',
    function ($scope, $http, $interval, $location, $window, $routeParams) {
        $scope.name = "guest join controller";


        $scope.joinConference = function () {
            //#/conference/video

            var conference_guest = {
                name: $scope.guest.name
            };

            var conferenceId = $routeParams.conferenceId;
            sessionStorage.setItem("conferenceId",  conferenceId);
            sessionStorage.setItem("conference_guest",  angular.toJson(conference_guest));
            $location.path("/conference/video");
        }
    }]);