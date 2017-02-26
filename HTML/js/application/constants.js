myApp.service('CONSTANTS', function () {

    this.SUCCESS = 'SUCCESS';
    this.FAILURE = 'FAILURE';
    this.POST = 'POST';
    this.GET = 'GET';
    //this.SERVICES_BASE_URL= 'http://ec2-52-40-162-133.us-west-2.compute.amazonaws.com:9001';
    this.SERVICES_BASE_URL = 'https://localhost:9001';

    this.STATUS_SUCCESS = "SUCCESS";
    this.STATUS_FAILURE = "FAILURE";
    //this.UI_APP_URL = $location.protocol() + "://" + $location.host() + ":" + $location.port();

    //ec2-35-161-127-166.us-west-2.compute.amazonaws.com
    this.CONFERENCING_URL_INSTANT_MEETING = 'https://localhost:3000/conferencing.html#/conference/join/guest';
    this.CONFERENCING_URL_PRESENTER = 'https://localhost:3000/conferencing.html#/conference/join/p';
    this.CONFERENCING_URL_ATTENDEE = 'https://localhost:3000/conferencing.html#/conference/join/a';

    //LOCAL STORAGE CONSTANTS
    this.USER_PROFILE = 'user_profile';
    this.INSTANT_MEETING_ID = 'instant_meeting_id';

    //EVENTS EMITTED
    this.USER_PROFILE_UPDATED = 'userProfileUpdated';
});


loginAppModule.service('CONSTANTS', function () {

    this.POST = 'POST';
    this.GET = 'GET';
    //this.SERVICES_BASE_URL= 'http://ec2-52-40-162-133.us-west-2.compute.amazonaws.com:9001';
    this.SERVICES_BASE_URL = 'https://localhost:9001';
    this.STATUS_SUCCESS = "SUCCESS";
    this.STATUS_FAILURE = "FAILURE";

    //SESSION STORAGE CONSANTS
    this.USER_PROFILE = 'user_profile';
    //this.UI_APP_URL = $location.protocol() + "://" + $location.host() + ":" + $location.port();
});

//constants for conference module
conferenceAppModule.service('CONSTANTS', function () {

    this.POST = 'POST';
    this.GET = 'GET';
    //this.SERVICES_BASE_URL= 'http://ec2-52-40-162-133.us-west-2.compute.amazonaws.com:9001';
    this.SERVICES_BASE_URL = 'https://localhost:9001';
    this.STATUS_SUCCESS = "SUCCESS";
    this.STATUS_FAILURE = "FAILURE";

    //SESSION STORAGE CONSANTS
    this.USER_PROFILE = 'user_profile';
    this.CONFERENCE_ID = 'conferenceId';
    this.SOCIAL_VID_CONFERENCE_URL = 'socialVidConferenceUrl';
    //this.UI_APP_URL = $location.protocol() + "://" + $location.host() + ":" + $location.port();
});