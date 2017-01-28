/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('pastClassController', ['$scope', '$http', '$interval', '$location', '$window', 'CONSTANTS', 'common',
    function ($scope, $http, $interval, $location, $window, CONSTANTS, common) {

        $scope.name = "past class controller";

        var userId = localStorage.getItem("userId");

        //the URL
        var url = CONSTANTS.SERVICES_BASE_URL + "/meetings/all/" + userId + "/PAST";

        $scope.status = {};

        //execute request
        $scope.pastClassPromise = common.httpRequest(url, CONSTANTS.GET, null);

        //handling the promise
        $scope.pastClassPromise.success(function (data, status, headers, config) {
            console.log('Got back a response');
            console.log(data);
            console.log("clearing off the data");

            var status = data.status;

            if (status === CONSTANTS.STATUS_SUCCESS) {
                $scope.pastClasses = data.data;
            } else {
                //failed login
                //print the message
                errorMesage(data.errorResponse.errorMessage);
            }
            //$location.path('/admin/login');
        }).error(function (data, status, headers, config) {
            console.log('AWS DOWN');
            errorMesage(data.errorMessage);
        });

        //clearing all the status
        function clearStatus() {
            $scope.status = {};
            $scope.message = "";
            console.log("clearing status");
        };

        //print success message
        function successMesage(message) {
            $scope.status.request_success = "true";
            $scope.message = message;
            $interval(clearStatus, 6000, 1);    //clear the status after 6 sec
        };

        //print failure message
        function errorMesage(message) {
            $scope.status.request_failure = "true";
            $scope.message = message;
            $interval(clearStatus, 10000, 1);    //clear the status after 10 sec
        };


    }]);