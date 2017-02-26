/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('userProfileController', ['$scope', '$rootScope', '$http', '$interval', '$location', '$window', 'common', 'AppConstants',
    function ($scope, $rootScope, $http, $interval, $location, $window, common, AppConstants) {

        /*Image Cop plugin setup*/
        $scope.userImage='';
        $scope.userCroppedImage='';

        var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.userImage=evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

        var userId = localStorage.getItem("userId");

        //the URL
        var url = AppConstants.SERVICES_BASE_URL + "/user/profile/" + userId;

        $scope.status = {};

        //execute request
        $scope.userProfilePromise = common.httpRequest(url, AppConstants.GET, null);

        //handling the promise
        $scope.userProfilePromise.success(function (data, status, headers, config) {

            console.log('Got back a response');
            console.log(data);
            console.log("clearing off the data");
            console.log("status : " + status);

            if (data.status === AppConstants.SUCCESS) {
                $scope.user = {
                    id : data.data.id,
                    emailid : data.data.emailId,
                    designation : data.data.designation,
                    department : data.data.department
                }
                //$scope.upcomingClasses = data.data;
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

        $scope.updateProfile = function () {
            console.log($scope.userImage);

            var updatedProfile = {
                id : $scope.user.id,
                imageString : $scope.userImage
            }

            var url = AppConstants.SERVICES_BASE_URL + "/user/updateprofile";

            //execute request
            $scope.userProfileUpdatePromise = common.httpRequest(url, AppConstants.POST, updatedProfile);

            //handling the promise
            $scope.userProfileUpdatePromise.success(function (data, status, headers, config) {

                console.log('Got back a response');
                console.log(data);
                console.log("clearing off the data");
                console.log("status : " + status);
                if (data.status === AppConstants.SUCCESS) {

                    $scope.someImage = data.data.imageBlob;
                    localStorage.setItem(AppConstants.USER_PROFILE, angular.toJson(data.data));

                    //publish updation of user profile
                    $rootScope.$broadcast(AppConstants.USER_PROFILE_UPDATED, data.data);
                    successMesage("Profile Updated Successfully");
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
        }


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
        //$scope.someImage = "data:image/png;base64,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";

    }]);