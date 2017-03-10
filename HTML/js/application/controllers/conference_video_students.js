/**
 * Created by pkonwar on 1/15/2017.
 */
conferenceAppModule.controller('conferenceStudentsController', ['$rootScope', '$scope', '$timeout', '$http', '$interval', '$location', '$window', 'AppConstants',
    function ($rootScope, $scope, $timeout, $http, $interval, $location, $window, AppConstants) {

        $(document).ready(function () {

            //show a notification to show chat
            $rootScope.$broadcast("showChatInWindow", "true");

            $scope.status = {
                showRaiseMyHand : true
            };

            var conference_guest =  angular.fromJson(sessionStorage.getItem("conference_guest"));

            var server = "nstl.socialvid.in";
            var callback = function (msg) {
                //callback
                console.log('in the server callback console.');
            };

            console.log("inside code.");
            var client = new WebRtcClient(server, callback);

            $scope.$on("broadcastChat", function (event, message) {
                console.log("inside broadcast chat" + message);
                console.log(message);
                client.sendChat(message);
            });

            $scope.stopshare = function () {
                //g("mainFormShareBtn").style.opacity = 0.5;
                client.stopShare(function(msg) {
                    //self.hideShareVideo();
                    //document.getElementById("mainFormShareVideo1").src = "";
                    document.getElementById("mainFormShareVideo1").src = "";
                    document.getElementById("mainFormShareVideo1").style.display = "none";
                    document.getElementById("mainFormShareVideoImage").style.display = "block";
                    //document.getElementById("shareBtn").style.display = "block";
                    //document.getElementById("mainFormShareVideo1").style.display = "none"
                    //document.getElementById("mainFormShareVideo1").poster="img/example1.jpg";
                    //self.presenting_ = false;
                });
            };

            //raise my hand
            $scope.raiseMyHand = function () {
                console.log("Raising hand by students");
                client.raiseHand();
                $scope.status.showRaiseMyHand = false;
            };

            $scope.share = function () {
                console.log("sharing");

                client.isShareEnabled(function(b) {
                    if (!b) {
                        var x = "To start sharing - ";
                        x += "<a href='https://chrome.google.com/webstore/detail/socialvid-webrtc-share/bjhmiolgijcdfhdjlgpdaofbbdlpefmc' target='_blank'>Install Extension</a>";
                        //self.showModal(x, true, true, "OK");
                        console.log(x);
                        return;
                    }
                    client.startShare(function(msg) {
                        switch(msg.type) {
                            case "localShareStream":
                                //g("mainFormShareBtn").style.opacity = 1.0;
                                document.getElementById("mainFormShareVideo1").style.display = "block"
                                document.getElementById("mainFormShareVideoImage").style.display = "none";
                                //document.getElementById("shareBtn").style.display = "none";
                                attachMediaStream(document.getElementById("mainFormShareVideo1"), msg.stream);
                                //self.showShareVideo("Me");
                                //self.presenting_ = true;
                                break;

                            case "localShareStreamEnded":
                                console.log("&&&&&&&  sharing stopped!!")
                                $scope.stopshare();
                                break;

                            case "shareOffer":
                                break;

                            case "shareGetUserMediaFailed":
                                //self.showModal("Start share failed - " + msg.error.name, true, true, "OK");
                                console.log("Start share failed - " + msg.error.name);
                                break;
                        }
                    });
                });

            }

            //join the conference
            //var conferenceId = sessionStorage.getItem("conferenceId");
            var conferenceId = sessionStorage.getItem(AppConstants.CONFERENCE_ID);
            var conferenceUrl = sessionStorage.getItem(AppConstants.SOCIAL_VID_CONFERENCE_URL);
            console.log("Printing name");
            console.log(conferenceId);
            //conferenceId = "98c9ca76299b7af9";
            //client.guestLogin(conference_guest.name, "98c9ca76299b7af9", function (loginStatus) {

            //client.guestLogin(conference_guest.name, "98c9ca76299b7af9", function (loginStatus) {
            client.guestLoginWithOptions(conference_guest.name, conferenceId, conferenceUrl, function (loginStatus) {
                if (loginStatus.status === 0) {
                    // Do the next steps here, like joining a conference
                    console.log("guest login successful");
                    /*var canvas1 = document.getElementById("mainFormCanvas");
                     var canvas2 = document.getElementById("mainFormCanvas2");
                     client.setCanvases(canvas1, canvas2);*/

                    //client.muteMicrophone();    //mute the mic
                    client.joinVideoConference(conferenceId, function (resp) {

                        console.log(resp.type);

                        switch (resp.type) {
                            case "mainIceConnectionState" :

                                console.log(resp);
                                console.log("this is for the mainICE BREAKER*********");
                                if(resp.state === "completed") {
                                    console.log("ICE BREAKER WORKS &&&&& ");
                                    client.muteMicrophone();        //mute all the mic of the attendees
                                }
                                break;
                            /*case "localStream":
                                attachMediaStream(document.getElementById("mainFormSelfVideo"), resp.stream);
                                break;*/

                            case "confRaiseHand" :
                                //receive a conference hand raise
                                console.log("+++++++++++++++++ raise hand slogan %%%%%%%%%%%%%%%%%%%%%%%%%");
                                break;

                            case "confRaiseHandResponse" :
                                //this is called in response of the presenter
                                //need to check if the presenter has allowed to check or not
                                console.log("~~~~~~~~~~~~~~~~~~~~~~ Got a response from the presenter ~~~~~~~~~~~~~~~~~~~~~~");
                                console.log(resp);
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

                                if (resp.audioUnmuted) {
                                    /*btn = g("mainFormMicrophoneBtn");
                                    btn.className = btn.className.replace("mic-mute", "mic-unmute");
                                    btn.disabled = false;*/
                                    console.log("***** ^^^^^^^^^^^^^^^ unmuting mic");
                                    console.log(resp.audioUnmuted);
                                    client.unmuteMicrophone();
                                } else {
                                    /*btn = g("mainFormMicrophoneBtn");
                                    btn.className = btn.className.replace("mic-unmute", "mic-mute");
                                    btn.disabled = true;*/
                                    console.log("***** ^^^^^^^^^^^^^^^ muting mic");
                                    client.muteMicrophone();

                                    //show the raise hand in the next digest
                                    $timeout(function () {
                                        $scope.status.showRaiseMyHand = true;
                                    })

                                }

                                break;
                            case "confChatMessage":
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
                                console.log("**** remote stream called " + resp.index);
                                if(resp.index === 1) {
                                    var videoElement = document.getElementById("mainVideo" + resp.index); // The index gives the stream id, It is 1 based
                                    attachMediaStream(videoElement, resp.stream); // Attach all the remote streams, but do not display them -  hide them
                                }
                                break;

                            case "activeTalkerList":
                                var talkers = resp.talkers.map(function (a) {
                                    return a.videoNo;
                                });
                                var names = resp.talkers.map(function (b) {
                                    return b.name;
                                });

                                console.log("Active Talker ID's");
                                console.log(talkers);
                                console.log("Active Talker Name's:");
                                console.log(names);
                                console.log("The Response containing the details are : ");
                                console.log(resp);

                                // this function shows the indices in talkers, and sets the name tag for those video participants
                                // If index is 0, it means it is an audio only participant, ignore
                                // If index is greater than 0, display that remoteStream and set the corresponding name tag from names
                                // For eg, if talkers is [2, 3] and names is ['a', 'b'], then remoteStream 2 and 3 need to be displayed and the name tag for those streams is a and b
                                for (var i = 0; i < talkers.length; i++) {
                                    if (talkers[i] == 1) {
                                        var videoElement = document.getElementById("mainVideo" + talkers[i]);
                                        videoElement.style.display = "block"; // Show the video element
                                        var participantName = document.getElementById("mainName" + talkers[i]);
                                        participantName.style.display = "block"; // Show the video element
                                        participantName.innerHTML = names[i];
                                    }
                                }

                                console.log("((((((((((( Active talker Updated!! ))))))))))))");
                                break;

                            case "recordingStarted": // Give an indication to the user that this conference is being recorded
                                break;

                            case "recordingStopped": // Give an indication to the user that this conference is no longer recorded
                                break;

                            case "remoteShareStream":
                                document.getElementById("mainFormShareVideo1").style.display = "block";
                                document.getElementById("mainFormShareVideoImage").style.display = "none";
                                //document.getElementById("shareBtn").style.display = "none";
                                attachMediaStream(document.getElementById("mainFormShareVideo1"), resp.stream);
                                break;
                            case "confStopShare":
                                document.getElementById("mainFormShareVideo1").style.display = "none";
                                document.getElementById("mainFormShareVideo1").src = "";
                                document.getElementById("mainFormShareVideoImage").style.display = "block";
                                //document.getElementById("shareBtn").style.display = "block";
                                break;

                            case "userAudioMuted" :
                                console.log("user audio muted");
                                client.muteMicrophone();
                                break;

                            case "userAudioUnmuted" :
                                console.log("user audio unmuted");
                                client.unmuteMicrophone();
                                break;

                            case "confApplicationData":
                                //Handle user defined response
                                console.log("&&&&&&&&& Received data on the server side!");
                                //var response = JSON.parse(resp);
                                //this data is to be send to the chatController for processing
                                var applicationData = JSON.parse(resp.applicationData);

                                switch (applicationData.type) {
                                    case "confParticipantHandRaised" :
                                        //sending the parsed application data to the chat controller
                                        $rootScope.$broadcast(AppConstants.CONFERENCE_HAND_RAISE, applicationData);
                                        break;

                                    case "customUnmuteAttendee" :
                                        console.log("(( Custom UNMUTE ))");
                                        console.log(applicationData);
                                        $rootScope.$broadcast(AppConstants.UNMUTE_THAT_ATTENDEEID_ON_ATTENDEE_SCREEN, applicationData.id);
                                        break;

                                    case "customMuteAttendee" :
                                        console.log("(( Custom MUTE ))");
                                        console.log(applicationData);
                                        $rootScope.$broadcast(AppConstants.MUTE_THAT_ATTENDEEID_ON_ATTENDEE_SCREEN, applicationData.id);
                                        break;

                                }
                                console.log(applicationData);
                                break;

                            case "participantsUpdated": // This gives the updated list of participants in the conference

                                var participantMap = {};
                                console.log("participants updated");
                                console.log(resp.participants);

                                for (var i = 0; i < resp.participants.length; i++) {
                                    var videoId = resp.participants[i].id;
                                    participantMap[videoId] = resp.participants[i];
                                }

                                console.log("updated participant MAP");
                                console.log(participantMap);

                                //show a notification to show chat
                                $rootScope.$broadcast(AppConstants.SHOW_PARTICIPANTS_IN_CHAT_WINDOW, participantMap);

                                break;

                            case "userFilesTransferRequest":
                            case "confFilesTransferRequest":
                                this.downloadFile(resp.files);
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


