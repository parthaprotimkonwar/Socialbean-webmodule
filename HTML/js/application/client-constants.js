/**
 * Created by parthaprotimkonwar on 26/02/17.
 */

var ClientConstants = angular.module('ClientConstants', [])
    .service('AppConstants', function () {

        //status
        this.SUCCESS = 'SUCCESS';
        this.FAILURE = 'FAILURE';
        this.POST = 'POST';
        this.GET = 'GET';

        //session storage
        //this.USER_PROFILE = 'user_profile';
        this.CONFERENCE_ID = 'conferenceId';
        this.SOCIAL_VID_CONFERENCE_URL = 'socialVidConferenceUrl';
        this.CONFERENCE_GUEST = 'conference_guest';
        this.USER_ID = "userId";
        this.USER_NAME = "userName";

        //remote urls
        this.SERVICES_BASE_URL = 'https://localhost:9001';
        this.CONFERENCING_URL_INSTANT_MEETING = 'https://localhost:3000/conferencing.html#/conference/join/guest';
        this.CONFERENCING_URL_PRESENTER = 'https://localhost:3000/conferencing.html#/conference/join/p';
        this.CONFERENCING_URL_ATTENDEE = 'https://localhost:3000/conferencing.html#/conference/join/a';

        //EVENTS EMITTED
        this.USER_PROFILE_UPDATED = 'userProfileUpdated';

        //LOCAL STORAGE CONSTANTS
        this.USER_PROFILE = 'user_profile';
        this.INSTANT_MEETING_ID = 'instant_meeting_id';
    });