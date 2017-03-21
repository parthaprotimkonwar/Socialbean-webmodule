/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('pastClassController', ['$scope', '$http', '$interval', '$location',
    '$window', 'common', 'AppConstants',
    function ($scope, $http, $interval, $location, $window, common, AppConstants) {

        $scope.name = "past class controller";
        $scope.videoLinksMap = {};

        var userId = localStorage.getItem(AppConstants.USER_ID);

        //the URL
        var url = AppConstants.SERVICES_BASE_URL + "/meetings/all/" + userId + "/PAST";

        $scope.status = {};

        //execute request
        $scope.pastClassPromise = common.httpRequest(url, AppConstants.GET, null);

        //handling the promise
        $scope.pastClassPromise.success(function (data, status, headers, config) {
            console.log('Got back a response');
            console.log(data);
            console.log("clearing off the data");

            var status = data.status;

            if (status === AppConstants.SUCCESS) {
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


        function generateVideoLinks(videoList) {

            var videoLinksArray = [];
            for(var i=0;i<videoList.length; i++) {

                var videoObject = videoList[i]; //get each object
                //expected {confId,confName, host, path, startTime, userId, userName}

                var videoPath = videoObject.path;   // /videos/981921861291/adf0c84ffa15c0d9/master.json
                var splittedTokens = videoPath.split("/");
                var videoTokens = {
                    videoId : splittedTokens[2], uniqueId : splittedTokens[3], id : i
                };
                videoLinksArray.push(videoTokens);
            }
            return videoLinksArray;
        }

        //open video link in new tab
        $scope.openVideoLink = function(videoId, uniqueId) {

            //player.html#/video/981921861291/c229f7bb44080de7
            var videoPlayerUrl = AppConstants.UI_URL_BASE + "/player.html#/video/" + videoId + "/" + uniqueId;
            $window.open(videoPlayerUrl, '_blank');
        }

        //Getting the video links
        $scope.getVideoLinks = function (id, conferenceId) {

            //the URL
            var url = AppConstants.SERVICES_BASE_URL + "/meetings/recorded/url/" + conferenceId;

            $scope.status = {};

            //execute request
            $scope.pastClassPromise = common.httpRequest(url, AppConstants.GET, null);

            //handling the promise
            $scope.pastClassPromise.success(function (data, status, headers, config) {
                console.log('Got back a response');
                console.log(data);
                console.log("clearing off the data");

                var status = data.status;

                if (status === AppConstants.SUCCESS) {

                    //$scope.videoLinksMap[id] = data.data;
                    console.log("video links map");
                    //console.log($scope.videoLinksMap[id]);

                    $scope.videoLinksMap[id] = generateVideoLinks(data.data.recordings);

                } else {
                    //failed login
                    //print the message
                    errorMesage(data.errorResponse.errorMessage);
                }
            }).error(function (data, status, headers, config) {
                console.log('AWS DOWN');
                errorMesage(data.errorMessage);
            });
        }

    }]);