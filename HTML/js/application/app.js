/*
 A Module is a small part of the project.
 Each module combines together to form an entire application.
 A module has a module name and initialized by ng-app in the html document

 var myApp = angular.module('myApp', []);
 Here myApp is the name of the namespace and [] contains the dependecy services which need to be injected in the module.
 */
var myApp = angular.module('myApp', [
    'ngRoute', 'ngImgCrop', 'ClientCustomization','ClientConstants','http_request'
]);

//main page is index.html
myApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.when('/admin/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'dashboardController'
    }).when('/admin/user/profile', {
        templateUrl: 'partials/user-profile-partial.html',
        controller: 'userProfileController'
    }).when('/admin/class/create', {
        templateUrl: 'partials/create-class-partial.html',
        controller: 'createClassController'
    }).when('/admin/class/quick', {
        templateUrl: 'partials/quick-meeting-partial.html',
        controller: 'quickMeetingController'
    }).when('/admin/class/past', {
        templateUrl: 'partials/past-class-partial.html',
        controller: 'pastClassController'
    }).when('/admin/class/upcoming', {
        templateUrl: 'partials/upcoming-class-partial.html',
        controller: 'upcomingClassController'
    }).when('/admin/class/quick/summary', {
        templateUrl: 'partials/quick-meeting-summary.html',
        controller: 'quickMeetingSummaryController'
    }).otherwise({
        redirectTo: '/admin/dashboard'
    });
}]);


//login module
var loginAppModule = angular.module('loginAppModule', [
    'ngRoute', 'ClientCustomization', 'ClientConstants', 'http_request'
]);

//main page is login.html
loginAppModule.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/admin/login', {
        templateUrl: 'partials/login-partial.html',
        controller: 'loginController'
    }).when('/admin/register', {
        templateUrl: 'partials/register-partial.html',
        controller: 'registerController'
    }).otherwise({
        redirectTo: '/admin/login'
    });
}]);

//conference module
var conferenceAppModule = angular.module('conferenceAppModule', [
    'ngRoute', 'ClientCustomization', 'ClientConstants', 'http_request'
]);


//main page is login.html
conferenceAppModule.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/conference/video/teachers', {
        //join as a teacher
        //teacher can present and see the students
        templateUrl: 'partials/video-conference-teacher-partial.html',
        controller: 'conferenceTeacherController'
    }).when('/conference/video/students', {
        //join as a students
        //students can see the teachers screen only
        templateUrl: 'partials/video-conference-students-partial.html',
        controller: 'conferenceStudentsController'
    }).when('/conference/video/group', {
        //quick video conference
        //creates a group video call
        templateUrl: 'partials/video-conference-partial.html',
        controller: 'conferenceVideoController'
    }).when('/conference/join/:guestType/:conferenceId', {
        //main screen
        templateUrl: 'partials/guest-join-conference-partial.html',
        controller: 'conferenceGuestJoinController'
    }).when('/conference/unknown', {
        //unknown
        templateUrl: 'partials/partial-404.html'
    }).otherwise({
        //default page
        redirectTo: '/conference/unknown'
    });
}]);