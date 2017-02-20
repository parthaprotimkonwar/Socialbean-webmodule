/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('quickMeetingController', ['$scope', '$http', '$interval', '$location', '$window', 'CONSTANTS', 'common',
    function ($scope, $http, $interval, $location, $window, CONSTANTS, common) {

        $scope.name = "quick meeting controller";
        $scope.meeting = {};
        $scope.meeting.phase = 'AM';
        $scope.meeting.hour = '10';
        $scope.meeting.minutes = '30';

        $scope.schedule = function () {

            //the URL
            var url = CONSTANTS.SERVICES_BASE_URL + "/meetings/instant";

            $scope.status = {};

            //"04/07/2017 23:02:55"
            var userId = localStorage.getItem("userId");
            //var updatedDate = $scope.meeting.datetime + " " + $scope.meeting.hour + ":" + $scope.meeting.minutes + " " + $scope.meeting.phase;
            //console.log("updated date : " + updatedDate);
            //var thedate = calculateDate(updatedDate);
            //console.log("the date : " + thedate);

            var data = {
                "title": $scope.meeting.topic,
                "presenterId": userId,
                "description": $scope.meeting.description,
                "invitees" : $scope.meeting.invitees
            };

            console.log("data to be send :");
            console.log(data);

            //execute request
            $scope.quickMeetingPromise = common.httpRequest(url, CONSTANTS.POST, data);

            //handling the promise
            $scope.quickMeetingPromise.success(function (data, status, headers, config) {
                console.log('Got back a response');
                console.log(data);
                console.log("clearing off the data");

                var status = data.status;

                if (status === CONSTANTS.STATUS_SUCCESS) {
                    //login is successful
                    $scope.meeting = {};       //clearing off the user registration form
                    successMesage("Meeting Scheduled successfully");
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
        };

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