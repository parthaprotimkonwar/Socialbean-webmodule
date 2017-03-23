/**
 * Created by pkonwar on 1/15/2017.
 */
conferenceAppModule.controller('conferenceVideoController', ['$rootScope', '$scope', '$http', '$interval', '$location', '$window', 'AppConstants',
    function ($rootScope, $scope, $http, $interval, $location, $window, AppConstants) {

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
                    document.getElementById("mainFormCanvas").style.display = "none";
                    document.getElementById("mainFormCanvas2").style.display = "none";
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
                        //x += "<a href='https://chrome.google.com/webstore/detail/socialvid-webrtc-share/bjhmiolgijcdfhdjlgpdaofbbdlpefmc' target='_blank'>Install Extension</a>";
                        //self.showModal(x, true, true, "OK");
                        $scope.status = {
                            requireSharingExtension : true
                        };
                        return;
                    }


                    client.startShare(function(msg) {
                        switch(msg.type) {

                            case "localShareStream":

                                //g("mainFormShareBtn").style.opacity = 1.0;
                                document.getElementById("mainFormShareVideo1").style.display = "block";
                                document.getElementById("mainFormShareVideoImage").style.display = "none";
                                document.getElementById("shareBtn").style.display = "none";
                                attachMediaStream(document.getElementById("mainFormShareVideo1"), msg.stream);

                                var width = document.getElementById("mainFormShareVideo").clientWidth;
                                var height = document.getElementById("mainFormShareVideo").clientHeight;

                                var canvas1 = document.getElementById("mainFormCanvas");
                                var canvas2 = document.getElementById("mainFormCanvas2");

                                canvas1.style.display = "block";
                                canvas2.style.display = "block";

                                client.resizeCanvas(width * 1.05, (width/1.55));
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
            };

            //join the conference
            var conferenceId = sessionStorage.getItem("conferenceId");
            console.log("Printing name");
            console.log(conferenceId);
            client.guestLogin(conference_guest.name, conferenceId, function (loginStatus) {
                if (loginStatus.status === 0) {
                    // Do the next steps here, like joining a conference
                    console.log("guest login successful");
                    client.setCanvases(document.getElementById("mainFormCanvas"),document.getElementById("mainFormCanvas2"));
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

                            case "remoteShareStream":
                                //remote share screen
                                document.getElementById("mainFormShareVideo1").style.display = "block";
                                document.getElementById("mainFormShareVideoImage").style.display = "none";
                                document.getElementById("shareBtn").style.display = "none";
                                attachMediaStream(document.getElementById("mainFormShareVideo1"), resp.stream);

                                //show the canvas on the screen
                                var width = document.getElementById("mainFormShareVideo").clientWidth;
                                var height = document.getElementById("mainFormShareVideo").clientHeight;

                                var canvas1 = document.getElementById("mainFormCanvas");
                                var canvas2 = document.getElementById("mainFormCanvas2");

                                canvas1.style.display = "block";
                                canvas2.style.display = "block";

                                client.resizeCanvas(width * 1.05, (width/1.55));
                                break;

                            case "confStopShare":
                                //remote unshare screen
                                document.getElementById("mainFormShareVideo1").style.display = "none";
                                document.getElementById("mainFormShareVideo1").src = "";
                                document.getElementById("mainFormShareVideoImage").style.display = "block";
                                document.getElementById("shareBtn").style.display = "block";

                                //remove the canvas
                                document.getElementById("mainFormCanvas").style.display = "none";
                                document.getElementById("mainFormCanvas2").style.display = "none";
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

                                console.log("***((((( Active Talker List )))))*****");
                                console.log(resp);
                                console.log(talkers);
                                console.log(names);
                                // this function shows the indices in talkers, and sets the name tag for those video participants
                                // If index is 0, it means it is an audio only participant, ignore
                                // If index is greater than 0, display that remoteStream and set the corresponding name tag from names
                                // For eg, if talkers is [2, 3] and names is ['a', 'b'], then remoteStream 2 and 3 need to be displayed and the name tag for those streams is a and b
                                for(var i=1;i<=7;i++) {
                                    document.getElementById("mainVideo" + i).style.display = "none";
                                    document.getElementById("mainName" + i).style.display = "none";
                                }
                                for (var i = 0; i < talkers.length; i++) {
                                    if (talkers[i] > 0) {
                                        var videoElement = document.getElementById("mainVideo" + talkers[i]);
                                        videoElement.style.display = "block"; // Show the video element
                                        var participantName = document.getElementById("mainName" + talkers[i]);
                                        participantName.innerHTML = names[i];
                                        participantName.style.display = "block";
                                    }
                                }
                                break;

                            case "recordingStarted": // Give an indication to the user that this conference is being recorded
                                break;

                            case "recordingStopped": // Give an indication to the user that this conference is no longer recorded
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


