myApp.service('CONSTANTS', function () {

    this.SUCCESS = 'SUCCESS';
    this.FAILURE = 'FAILURE';
    this.POST = 'POST';
    this.GET = 'GET';
    //this.SERVICES_BASE_URL= 'http://ec2-52-40-162-133.us-west-2.compute.amazonaws.com:9001';
    this.SERVICES_BASE_URL = 'http://localhost:9000';

    this.STATUS_SUCCESS = "SUCCESS";
    this.STATUS_FAILURE = "FAILURE";
    //this.UI_APP_URL = $location.protocol() + "://" + $location.host() + ":" + $location.port();

    this.CONFERENCING_URL = 'http://localhost:3000/conferencing.html#/conference/join/guest';

    //LOCAL STORAGE CONSTANTS
    this.USER_PROFILE = 'user_profile';

    //EVENTS EMITTED
    this.USER_PROFILE_UPDATED = 'userProfileUpdated';
});


loginAppModule.service('CONSTANTS', function () {

    this.POST = 'POST';
    this.GET = 'GET';
    //this.SERVICES_BASE_URL= 'http://ec2-52-40-162-133.us-west-2.compute.amazonaws.com:9001';
    this.SERVICES_BASE_URL = 'http://localhost:9000';
    this.STATUS_SUCCESS = "SUCCESS";
    this.STATUS_FAILURE = "FAILURE";
    this.USER_PROFILE = 'user_profile'
    //this.UI_APP_URL = $location.protocol() + "://" + $location.host() + ":" + $location.port();
});
