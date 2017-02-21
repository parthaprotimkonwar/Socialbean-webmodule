/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('quickMeetingSummaryController', ['$scope', '$http', '$interval', '$location', '$window', 'CONSTANTS', 'common',
    function ($scope, $http, $interval, $location, $window, CONSTANTS, common) {

        console.log("in summary page");

        $scope.instantMeetingToken = sessionStorage.getItem(CONSTANTS.INSTANT_MEETING_ID);
        console.log($scope.instantMeetingToken);

        $scope.conferenceUrlInstantMeeting = CONSTANTS.CONFERENCING_URL_INSTANT_MEETING;

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