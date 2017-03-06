/**
 * Created by pkonwar on 1/27/2017.
 */
conferenceAppModule.controller('conferenceChatController', ['$scope', '$rootScope', '$timeout', '$http', '$interval', '$location', '$anchorScroll', '$window', 'ThemeText', 'AppConstants',
    function ($scope, $rootScope, $timeout, $http, $interval, $location, $anchorScroll, $window, ThemeText, AppConstants) {

        $scope.countId = 0;
        $scope.chatsHistoryArray = [];
        $scope.participantsArray = [];
        $scope.chatDisplayStatus;

        $scope.themeText = ThemeText;
        $scope.participantMap;
        $scope.$on("showChatInWindow", function (event, message) {
            $timeout(function () {
                $(".sidepanel").show(100);    //toggle the status of the chat window
                $scope.chatDisplayStatus = "true";  //show chat
            })
        });

        //mute the attendee
        $scope.muteTheAtteendee = function (id) {
            $rootScope.$broadcast(AppConstants.MUTE_ATTENDEE, id);

            $timeout(function () {
                //set the raise hand flag for the new participant
                $scope.participantMap[id].raiseHand = false;
                $scope.participantMap[id].audio = "muted";

                //update the participant map
                updateTheParticipants($scope.participantMap);
            });
        }

        //unmute the attendee
        $scope.unmuteTheAtteendee = function (id) {
            $rootScope.$broadcast(AppConstants.UNMUTE_ATTENDEE, id);
            $timeout(function () {
                //set the raise hand flag for the new participant
                $scope.participantMap[id].raiseHand = false;
                $scope.participantMap[id].audio = "unmuted";

                //update the participant map
                var participants = [];

                for(var participant in $scope.participantMap) {
                    participants.push($scope.participantMap[participant]);
                }

                $scope.participantsArray = participants;
            });
        }


        function updateTheParticipants(participantMap) {
            //local participants
            var participants = [];

            for(var participant in participantMap) {
                participants.push(participantMap[participant]);
            }

            $scope.participantsArray = participants;
            console.log("Setting the participants in participantsArray : " + participants);
        }

        //display the participants in the chat window
        $scope.$on(AppConstants.SHOW_PARTICIPANTS_IN_CHAT_WINDOW, function (event, message) {

            $timeout(function () {
               $scope.participantMap = message;
               updateTheParticipants($scope.participantMap);
            });
        });

        //handle the conference hand raise event
        $scope.$on(AppConstants.CONFERENCE_HAND_RAISE, function (event, message) {

            $timeout(function () {
                //updating the specific map
                $scope.participantMap[message.participant.id] = message.participant;

                //set the raise hand flag for the new participant
                $scope.participantMap[message.participant.id].raiseHand = true;

                updateTheParticipants($scope.participantMap);
            });
        });


        $scope.$on("chatRecieved", function (event, message) {
            console.log("FINAL : on chatRecieved event");
            console.log(message);
            $scope.countId = $scope.countId + 1;
            var chat = {
                id: $scope.countId,
                name: message.name,
                chat: message.chat,
            };
            $timeout(function () {
                // anything you want can go here and will safely be run on the next digest.
                $scope.chatsHistoryArray.push(chat);
                var element = document.getElementById("chat-tabpanel");
                element.scrollTop = element.scrollHeight;
                //pushToChatterBox(chat);
                //$location.hash(chat.id);
                //$anchorScroll();
                //var element = document.getElementById("chatterBox");
                //element.scrollTop = element.scrollHeight;
            })

        });


        $scope.sendChatMessage = function () {
            console.log($scope.chat.message);
            if ($scope.chat.message === "") {
                return;
            }
            $scope.currentUser = angular.fromJson(sessionStorage.getItem("conference_guest"));
            $scope.countId = $scope.countId + 1;
            var chat = {
                id: $scope.countId,
                name: $scope.currentUser.name,
                chat: $scope.chat.message
            };

            //$scope.chatsHistoryArray.push(chat);
            pushToChatterBox(chat);
            //$location.hash(chat.id);
            //$anchorScroll();
            $rootScope.$broadcast("broadcastChat", $scope.chat.message);
            $scope.chat.message = "";   //clearing the message
        };

        function pushToChatterBox(chat) {
            if (chat == "") {
                return;
            }

            $scope.chatsHistoryArray.push(chat);
            //var element = document.getElementById("scrolling-chat-box");
            var element = document.getElementById("chat-tabpanel");
            console.log(element.scrollHeight);
            element.scrollTop = element.scrollHeight;
        }

        /*var element = document.getElementById("scrolling-chat-box");
         console.log(element.scrollHeight);
         element.scrollTop = element.scrollHeight;*/

    }]);
