/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('headerBarController', ['$scope', '$http', '$interval', '$location', '$window', 'CONSTANTS', 'common',
    function ($scope, $http, $interval, $location, $window, CONSTANTS, common) {

        $scope.username = localStorage.getItem("userName");

        $scope.logout = function () {
            localStorage.clear();
            var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/login.html?";
            $window.location.href = url;
        }

    }]);


