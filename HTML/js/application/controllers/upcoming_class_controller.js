/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('upcomingClassController', ['$scope', '$http', '$interval', '$location', '$window', 'common', 'AppConstants',
    function ($scope, $http, $interval, $location, $window, common, AppConstants) {

        $scope.name = "upcoming class controller";

        var userId = localStorage.getItem("userId");

        //the URL
        var url = AppConstants.SERVICES_BASE_URL + "/meetings/all/" + userId + "/NEW";

        $scope.status = {};

        //execute request
        $scope.upcomingClassPromise = common.httpRequest(url, AppConstants.GET, null);

        //handling the promise
        $scope.upcomingClassPromise.success(function (data, status, headers, config) {

            $scope.conferenceUrlInstantMeeting = AppConstants.CONFERENCING_URL_INSTANT_MEETING;
            $scope.conferenceUrlPresenter = AppConstants.CONFERENCING_URL_PRESENTER;
            $scope.conferenceUrlAttendee = AppConstants.CONFERENCING_URL_ATTENDEE;

            console.log('Got back a response');
            console.log(data);
            console.log("clearing off the data");

            var status = data.status;

            if (status === AppConstants.SUCCESS) {
                $scope.upcomingClasses = data.data;
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