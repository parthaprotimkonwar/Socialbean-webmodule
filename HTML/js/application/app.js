/*
 A Module is a small part of the project.
 Each module combines together to form an entire application.
 A module has a module name and initialized by ng-app in the html document

 var myApp = angular.module('myApp', []);
 Here myApp is the name of the namespace and [] contains the dependecy services which need to be injected in the module.
 */
var myApp = angular.module('myApp', [
    'ngRoute', 'ngImgCrop'
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
    }).when('/admin/class/past', {
        templateUrl: 'partials/past-class-partial.html',
        controller: 'pastClassController'
    }).when('/admin/class/upcoming', {
        templateUrl: 'partials/upcoming-class-partial.html',
        controller: 'upcomingClassController'
    }).otherwise({
        redirectTo: '/admin/dashboard'
    });
}]);


//login module
var loginAppModule = angular.module('loginAppModule', [
    'ngRoute'
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
    'ngRoute'
]);

//main page is login.html
conferenceAppModule.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/conference/video/teachers', {
        //join as a teacher
        templateUrl: 'partials/video-conference-teacher-partial.html',
        controller: 'conferenceTeacherController'
    }).when('/conference/video/students', {
        //join as a students
        templateUrl: 'partials/video-conference-students-partial.html',
        controller: 'conferenceStudentsController'
    }).when('/conference/video', {
        //quick video conference
        templateUrl: 'partials/video-conference-partial.html',
        controller: 'conferenceVideoController'
    }).when('/conference/join/guest/:conferenceId', {
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