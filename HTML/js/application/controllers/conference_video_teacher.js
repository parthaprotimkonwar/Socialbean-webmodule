/**
 * Created by pkonwar on 1/15/2017.
 */
conferenceAppModule.controller('conferenceTeacherController', ['$rootScope', '$scope', '$http', '$interval', '$location', '$window',
    function ($rootScope, $scope, $http, $interval, $location, $window) {

        $scope.name = "tea";

        $(document).ready(function () {

            //show a notification to show chat
            $rootScope.$broadcast("showChatInWindow", "true");

            var conference_guest =  angular.fromJson(sessionStorage.getItem("conference_guest"));

            var server = "ha.socialvid.in";
            var callback = function (msg) {
                //callback
                console.log('in the server callback console.');
            };

            console.log("inside code.");
            var client = new WebRtcClient(server, callback);
            var email = "arunsimon@gmail.com";
            var password = "Arun123";

            //get all the contacts
            var contactsCallback = function (contacts) {
                for (var j = 0; j < contacts.length; j++) {
                    console.log("parthaType:" + contacts[i].type);
                    console.log("parthaid" + contacts[i].id);
                }
            };

            var loginCallback = function (loginResponse) {
                if (loginResponse.status === 0) {
                    console.log("login successful");
                    //client.getContacts(contactsCallback);
                } else {
                    console.log("login unsuccessful");
                }
            };
            //client login
            client.login(email, password, loginCallback);



            /*$scope.sendThisChat = function () {
             console.log("char chat");
             client.sendChat("Ravi welcomes to his console.");
             };*/

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
                    document.getElementById("shareBtn").style.display = "block";
                    //document.getElementById("mainFormShareVideo1").style.display = "none"
                    //document.getElementById("mainFormShareVideo1").poster="img/example1.jpg";
                    //self.presenting_ = false;
                });
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
                                document.getElementById("shareBtn").style.display = "none";
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

                /*client.startShare(function(msg) {
                 switch(msg.type) {
                 case "localShareStream":
                 //document.getElementById("mainFormShareBtn").style.opacity = 1.0;
                 attachMediaStream(document.getElementById("mainFormShareVideo1"), msg.stream);
                 //self.showShareVideo("Me");
                 //self.presenting_ = true;
                 break;

                 case "localShareStreamEnded":
                 //stopShare();
                 break;

                 case "shareOffer":
                 break;

                 case "shareGetUserMediaFailed":
                 //self.showModal("Start share failed - " + msg.error.name, true, true, "OK");
                 break;
                 }
                 });*/
            }
            /*function chat() {
             console.log("char chat");
             client.sendChat("Ravi welcomes to his console.");
             return false;
             }*/

            //join the conference
            var conferenceId = sessionStorage.getItem("conferenceId");
            console.log("Printing name");
            console.log(conferenceId);
            conferenceId = "98c9ca76299b7af9";
            //client.guestLogin(conference_guest.name, "98c9ca76299b7af9", function (loginStatus) {

            client.guestLoginWithOptions(conference_guest.name, "98c9ca76299b7af9", "/guest.html?conferenceId=98c9ca76299b7af9&audio=1&video=1&dialout=0&moderator=1&c=05d3099aa06aa73b", function (loginStatus) {

                //client.guestLoginWithOptions(conference_guest.name, "98c9ca76299b7af9", "/guest.html?conferenceId=98c9ca76299b7af9&audio=1&video=1&dialout=0&moderator=0&c=f0a40dd706aeb73c", function (loginStatus) {

                //client.guestLogin(conference_guest.name, "98c9ca76299b7af9", function (loginStatus) {
                //client.guestLoginWithOptions(conference_guest.name, "98c9ca76299b7af9", "/guest.html?conferenceId=98c9ca76299b7af9&audio=1&video=1&dialout=0&moderator=0&c=f0a40dd706aeb73c", function (loginStatus) {
                if (loginStatus.status === 0) {
                    // Do the next steps here, like joining a conference
                    console.log("guest login successful");
                    /*var canvas1 = document.getElementById("mainFormCanvas");
                     var canvas2 = document.getElementById("mainFormCanvas2");
                     client.setCanvases(canvas1, canvas2);*/


                    client.joinVideoConference(conferenceId, function (resp) {

                        console.log(resp.type);

                        switch (resp.type) {
                            case "confRaiseHand" :
                                console.log("+++++++++++++++++ raise hand slogna %%%%%%%%%%%%%%%%%%%%%%%%%");
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
                                        participantName.style.display = "block"; // Show the video element
                                        participantName.innerHTML = names[i];
                                    }
                                }
                                break;

                            case "recordingStarted": // Give an indication to the user that this conference is being recorded
                                break;

                            case "recordingStopped": // Give an indication to the user that this conference is no longer recorded
                                break;

                            case "remoteShareStream":
                                document.getElementById("mainFormShareVideo1").style.display = "block";
                                document.getElementById("mainFormShareVideoImage").style.display = "none";
                                document.getElementById("shareBtn").style.display = "none";
                                attachMediaStream(document.getElementById("mainFormShareVideo1"), resp.stream);
                                break;
                            case "confStopShare":
                                document.getElementById("mainFormShareVideo1").style.display = "none";
                                document.getElementById("mainFormShareVideo1").src = "";
                                document.getElementById("mainFormShareVideoImage").style.display = "block";
                                document.getElementById("shareBtn").style.display = "block";
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


