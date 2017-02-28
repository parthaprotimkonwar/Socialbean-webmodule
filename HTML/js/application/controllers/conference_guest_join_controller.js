conferenceAppModule.controller('conferenceGuestJoinController', ['$scope', '$http', '$interval', '$location', '$window', '$routeParams', 'common','AppConstants',
    function ($scope, $http, $interval, $location, $window, $routeParams, common, AppConstants) {

        $scope.name = "conference guest join controller";

        //act as reverse proxy
        $scope.joinConference = function () {
            //#/conference/video

            var conference_guest = {
                name: $scope.guest.name
            };

            var conferenceId = $routeParams.conferenceId; //get the conference id
            var guestType = $routeParams.guestType;       //get the visitor type

            sessionStorage.setItem(AppConstants.CONFERENCE_ID,  conferenceId);
            //sessionStorage.setItem("conference_guest",  angular.toJson(conference_guest));
            sessionStorage.setItem(AppConstants.CONFERENCE_GUEST,  angular.toJson(conference_guest));

            if(guestType === 'p') {
                //join as a teacher or presenter
                //$location.path("/conference/video/teachers");
                $scope.getConferenceDetails('urls.audioVideo.moderator', '/conference/video/teachers');
            } else if(guestType === 'a') {
                //join as a student or attendee
                //$location.path("/conference/video/students");
                $scope.getConferenceDetails('urls.audioVideo.participant', '/conference/video/students');
            } else {
                //join as guest : quick login
                //talk in a group mode
                $location.path("/conference/video/group");
            }
        }


        $scope.getConferenceDetails = function (jsonKey, redirectUrlIfSuccessful) {

            var conferenceId = sessionStorage.getItem(AppConstants.CONFERENCE_ID);
            //the URL
            var url = AppConstants.SERVICES_BASE_URL + "/meetings/find/" + conferenceId;

            $scope.status = {};


            //execute request
            $scope.conferenceDetailsPromise = common.httpRequest(url, AppConstants.GET, null);

            //handling the promise
            $scope.conferenceDetailsPromise.success(function (data, status, headers, config) {
                console.log('Got back a response');
                console.log(data);
                console.log("clearing off the data");

                var status = data.status;

                if (status === AppConstants.SUCCESS) {
                    console.log("Server responded back.");
                    console.log(jsonKey);
                    //console.log(redirectIfSuccessful);
                    console.log(data.data);

                    //get the conferenceUrl
                    var conferenceUrl = $scope.getValueFromJsonObject(jsonKey, data.data);

                    if(conferenceUrl != undefined && conferenceUrl.length > 23) {
                        //strip out the https part
                        //23
                        //https://ha.socialvid.in/guest.html?conferenceId=3396f2bc72688b71&audio=1&video=1&dialout=0&moderator=1&c=1868821a5243c579
                        var socialVidUrlPrefix = AppConstants.SOCIAL_VID_URL_BASE;
                        //var url = "https://ha.socialvid.in";
                        //console.log("Length is : " + url.length);
                        conferenceUrl = conferenceUrl.substring(socialVidUrlPrefix.length, conferenceUrl.length);
                        //store the conference url
                        sessionStorage.setItem(AppConstants.SOCIAL_VID_CONFERENCE_URL, conferenceUrl);

                        //redirect now
                        $location.path(redirectUrlIfSuccessful);
                    }
                    console.log(conferenceUrl);

                } else {
                    //failed login
                    //print the message
                    //return null;
                    console.log("unable to fetch data from the server");
                }
            }).error(function (data, status, headers, config) {
                console.log('AWS DOWN');
                //errorMesage(data.errorMessage);
            });
        };

        $scope.getValueFromJsonObject = function(path, obj) {
            return path.split('.').reduce(function(prev, curr) {
                return prev ? prev[curr] : undefined
            }, obj || self)
        }
    }]);