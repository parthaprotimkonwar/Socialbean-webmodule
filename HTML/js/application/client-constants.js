/**
 * Created by parthaprotimkonwar on 26/02/17.
 */

var ClientConstants = angular.module('ClientConstants', [])
    .service('AppConstants', function () {

        //configuration part
        this.protocol = 'https';
        this.host = 'localhost';
        this.port = '3000';

        this.SOCIAL_VID_URL_BASE = "https://nstl.socialvid.in";

        this.UI_URL_BASE = this.protocol + "://" + this.host + ":" + this.port;



        //status
        this.SUCCESS = 'SUCCESS';
        this.FAILURE = 'FAILURE';
        this.POST = 'POST';
        this.GET = 'GET';


        //constants
        this.PRESENTER = 'PRESENTER';
        this.ATTENDEE = 'ATTENDEE';

        //session storage
                //this.USER_PROFILE = 'user_profile';
        this.CONFERENCE_ID = 'conferenceId';
        this.SOCIAL_VID_CONFERENCE_URL = 'socialVidConferenceUrl';
        this.CONFERENCE_GUEST = 'conference_guest';
        this.USER_ID = "userId";
        this.USER_NAME = "userName";

        //remote urls
        this.SERVICES_BASE_URL = 'https://localhost:9001';
        this.CONFERENCING_URL_INSTANT_MEETING = this.UI_URL_BASE + '/conferencing.html#/conference/join/guest';
        this.CONFERENCING_URL_PRESENTER = this.UI_URL_BASE + '/conferencing.html#/conference/join/p';
        this.CONFERENCING_URL_ATTENDEE = this.UI_URL_BASE + '/conferencing.html#/conference/join/a';

        //EVENTS EMITTED
        this.USER_PROFILE_UPDATED = 'userProfileUpdated';
        this.SHOW_PARTICIPANTS_IN_CHAT_WINDOW = 'showParticipantsInWindow';
        this.CONFERENCE_HAND_RAISE = 'conferenceHandRaise';
        this.MUTE_ATTENDEE = 'muteAttendee';
        this.UNMUTE_ATTENDEE = 'unmuteAttendee';
        this.UNMUTE_THAT_ATTENDEEID_ON_ATTENDEE_SCREEN = "unmuteThatAttendeeOnAttendeeScreen";
        this.MUTE_THAT_ATTENDEEID_ON_ATTENDEE_SCREEN = "muteThatAttendeeOnAttendeeScreen"

        //LOCAL STORAGE CONSTANTS
        this.USER_PROFILE = 'user_profile';
        this.INSTANT_MEETING_ID = 'instant_meeting_id';
    });