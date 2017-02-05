/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('headerBarController', ['$scope', '$rootScope','$timeout', '$http', '$interval', '$location', '$window', 'CONSTANTS', 'common',
    function ($scope, $rootScope, $timeout, $http, $interval, $location, $window, CONSTANTS, common) {

        //logout user
        $scope.logout = function () {
            localStorage.clear();
            var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/login.html?";
            $window.location.href = url;
        }

        $scope.userProfile = angular.fromJson(localStorage.getItem(CONSTANTS.USER_PROFILE));

        //logout if the user is not present
        if($scope.userProfile == null || $scope.userProfile === undefined) {
            console.log("executing logout");
            $scope.logout();
        }

        $scope.username = $scope.userProfile.presenterName;
        console.log("printing user profile.");

        //handler user profile updation events
        $scope.$on(CONSTANTS.USER_PROFILE_UPDATED, function (event, message) {
            console.log("inside broadcast chat" + message);
            console.log(message);
            $timeout(function () {
                $scope.userProfile.imageBlob = message.imageBlob;
            });
        });

    }]);


