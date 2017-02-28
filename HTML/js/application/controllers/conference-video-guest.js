/**
 * Created by pkonwar on 2/13/2017.
 */
/**
 * Created by pkonwar on 1/15/2017.
 */
conferenceAppModule.controller('conferenceVideoController', ['$rootScope', '$scope', '$http', '$interval', '$location', '$window',
    function ($rootScope, $scope, $http, $interval, $location, $window) {

        $(document).ready(function () {

            //show a notification to show chat
            $rootScope.$broadcast("showChatInWindow", "true");

            var conference_guest =  angular.fromJson(sessionStorage.getItem("conference_guest"));

            var server = "nstl.socialvid.in";
            var callback = function (msg) {
                //callback
                console.log('in the server callback console.');
            };

            console.log("inside code.");
            var client = new WebRtcClient(server, callback);
            var email = "arunsimon@gmail.com";
            var password = "Arun123";

            //get all the contacts
            /*var contactsCallback = function (contacts) {
             for (var j = 0; j < contacts.length; j++) {
             console.log("parthaType:" + contacts[i].type);
             console.log("parthaid" + contacts[i].id);
             }
             };*/

            var loginCallback = function (loginResponse) {
                if (loginResponse.status === 0) {
                    console.log("login successful");
                    //client.getContacts(contactsCallback);
                } else {
                    console.log("login unsuccessful");
                }
            };
            //client login
            //client.login(email, password, loginCallback);

            $scope.sendThisChat = function () {
                console.log("char chat");
                client.sendChat("Ravi welcomes to his console.");
            };

            $scope.$on("broadcastChat", function (event, message) {
                console.log("inside broadcast chat" + message);
                console.log(message);
                client.sendChat(message);
            });
            /*function chat() {
             console.log("char chat");
             client.sendChat("Ravi welcomes to his console.");
             return false;
             }*/

            //join the conference
            var conferenceId = sessionStorage.getItem("conferenceId");
            console.log("Printing name");
            console.log(conferenceId);
            client.guestLogin(conference_guest.name, conferenceId, function (loginStatus) {
                if (loginStatus.status === 0) {
                    // Do the next steps here, like joining a conference
                    console.log("guest login successful");

                    client.joinVideoConference(conferenceId, function (resp) {

                        console.log(resp.type);

                        switch (resp.type) {
                            case "localStream":
                                //var l = g("mainFormSelfVideo");
                                //l.src = "";
                                //self.localStream_ = resp.stream;
                                attachMediaStream(document.getElementById("mainFormSelfVideo"), resp.stream);
                                break;
                            case "confChatMessage":
                                console.log("CHAT CHAT CHAT chat");
                                console.log(resp.chat);
                                $rootScope.$broadcast("chatRecieved", resp);
                                break;
                            case "videoConfResponse":
                                if (resp.status !== 0) { // The join failed
                                    console.log("Conference full");
                                }
                                break;

                            case "disconnectConfResponse": // Call disconnected
                                console.log("Call Disconnected");
                                break;

                            case "getUserMediaFailed": // The client could not access camera/microphone, hence call failed.
                                console.log("Camera/Microphone access failed");
                                break;

                            case "remoteAudioStream": // attachMediaStream is a function in the client. Call it with
                                var audioElement = document.getElementById("mainAudio");
                                // this is the mixed audio stream of the conference, you can attach it to an audio html element in the page
                                attachMediaStream(audioElement, resp.stream);
                                break;

                            case "remoteStream": // This event is received multiple times. Attach it to the multiple video elements
                                console.log("****remote stream called " + resp.index);
                                var videoElement = document.getElementById("mainVideo" + resp.index); // The index gives the stream id, It is 1 based
                                attachMediaStream(videoElement, resp.stream); // Attach all the remote streams, but do not display them -  hide them
                                break;

                            case "activeTalkerList":
                                var talkers = resp.talkers.map(function (a) {
                                    return a.videoNo;
                                });
                                var names = resp.talkers.map(function (b) {
                                    return b.name;
                                });

                                console.log(talkers);
                                console.log(names);
                                // this function shows the indices in talkers, and sets the name tag for those video participants
                                // If index is 0, it means it is an audio only participant, ignore
                                // If index is greater than 0, display that remoteStream and set the corresponding name tag from names
                                // For eg, if talkers is [2, 3] and names is ['a', 'b'], then remoteStream 2 and 3 need to be displayed and the name tag for those streams is a and b
                                for (var i = 0; i < talkers.length; i++) {
                                    if (talkers[i] > 0) {
                                        var videoElement = document.getElementById("mainVideo" + talkers[i]);
                                        videoElement.style.display = "block"; // Show the video element
                                        var participantName = document.getElementById("mainName" + talkers[i]);
                                        //participantName.innerHTML = names[i];
                                    }
                                }
                                break;

                            case "recordingStarted": // Give an indication to the user that this conference is being recorded
                                break;

                            case "recordingStopped": // Give an indication to the user that this conference is no longer recorded
                                break;

                            case "participantsUpdated": // This gives the updated list of participants in the conference
                                var participantList = [];
                                for (var i = 0; i < resp.participants.length; i++) {
                                    var callType = resp.participants[i].callType; // Can be Voice or Video
                                    var name = resp.participants[i].name; // The name of the participant
                                    //data type to send across
                                    var participant  = {
                                        callType : callType,
                                        name : name
                                    };
                                    participantList.push(participant);
                                }
                                //show a notification to show chat
                                $rootScope.$broadcast("showParticipantsInWindow", participantList);
                                break;
                        }
                    });

                } else {
                    // Login failed, loginStatus.status has the error code which can be displayed to the user.
                    console.log("Login Failed - " + loginStatus.status);
                }
            });
        });
    }]);


