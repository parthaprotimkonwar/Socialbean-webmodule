conferenceAppModule.controller('conferenceGuestJoinController', ['$scope', '$http', '$interval', '$location', '$window', '$routeParams',
    function ($scope, $http, $interval, $location, $window, $routeParams) {
        $scope.name = "guest join controller";


        //act as reverse proxy
        $scope.joinConference = function () {
            //#/conference/video

            var conference_guest = {
                name: $scope.guest.name
            };

            var conferenceId = $routeParams.conferenceId;
            sessionStorage.setItem("conferenceId",  conferenceId);
            sessionStorage.setItem("conference_guest",  angular.toJson(conference_guest));

            if(conferenceId === 'teachers') {
                //join as a teacher
                $location.path("/conference/video/teachers");
                //$location.path("/conference/video/students");
            } else if(conferenceId === 'students') {
                //join as a student
                //$location.path("/conference/video/teachers");
                $location.path("/conference/video/students");
            } else {
                //join as guest : quick login
                //$location.path("/conference/video/students");
                //$location.path("/conference/video/teachers");
                $location.path("/conference/video");
            }
        }
    }]);