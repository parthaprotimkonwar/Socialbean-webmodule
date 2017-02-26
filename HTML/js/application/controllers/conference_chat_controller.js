/**
 * Created by pkonwar on 1/27/2017.
 */
conferenceAppModule.controller('conferenceChatController', ['$scope', '$rootScope', '$timeout', '$http', '$interval', '$location', '$anchorScroll', '$window', 'ThemeText',
    function ($scope, $rootScope, $timeout, $http, $interval, $location, $anchorScroll, $window, ThemeText) {

        $scope.countId = 0;
        $scope.chatsHistoryArray = [];
        $scope.participantsArray = [];
        $scope.chatDisplayStatus;

        $scope.themeText = ThemeText;

        $scope.$on("showChatInWindow", function (event, message) {
            $timeout(function () {
                $(".sidepanel").show(100);    //toggle the status of the chat window
                $scope.chatDisplayStatus = "true";  //show chat
            })
        });

        $scope.$on("showParticipantsInWindow", function (event, message) {
            $timeout(function () {
                $scope.participantsArray = message;
            });
        })

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
