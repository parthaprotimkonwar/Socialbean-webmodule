(function(m) {
var ASPECT_WIDTH = 16.0;
var ASPECT_HEIGHT = 9.0;

var getPositions = function(numVideos, grid, container) {

    if (numVideos <= 0) {
        return [];
    }

    var rows;
    var cols;

    if (grid) {
        switch (numVideos) {
            case 1:
                rows = cols = 1;
                break;

            case 2:
                rows = 1;
                cols = 2;
                break;

            case 3:
            case 4:
                rows = cols = 2;
                break;

            case 5:
            case 6:
                rows = 2;
                cols = 3;
                break;

            case 7:
            case 8:
            case 9:
                rows = 3;
                cols = 3;
                break;
        }
    } else {
        switch (numVideos) {
            case 1:
                cols = rows = 1;
                break;

            default:
                cols = numVideos;
                rows = numVideos - 1;
                break;
        }
    } 

    var reqdRatio = (ASPECT_WIDTH * cols) / (ASPECT_HEIGHT * rows);
    // var container = g("mainFormVideosContainer");

    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;

    var containerRatio = containerWidth/containerHeight;

    var layoutWidth;
    var layoutHeight;

    var offsetW = 0;
    var offsetH = 0;

    if (containerRatio > reqdRatio) {
        layoutHeight = containerHeight;
        layoutWidth = (containerWidth * reqdRatio) / containerRatio;
        offsetW = Math.floor( (containerWidth - layoutWidth) / 2);
    } else {
        layoutWidth = containerWidth;
        layoutHeight = (containerHeight * containerRatio) / reqdRatio;
        offsetH = Math.floor( (containerHeight - layoutHeight) / 2);
    }



    var videoWidth = Math.floor(layoutWidth / cols);
    var videoHeight = Math.floor(layoutHeight / rows);


    var positions = [];

    if (grid) {
        var count = 0;
        for (var k = 0; k < rows; k++) {
            for (var l = 0; l < cols; l++) {
                var pos = {};
                pos.top = videoHeight * k + offsetH;
                pos.left = videoWidth * l + offsetW;
                pos.width = videoWidth;
                pos.height = videoHeight;
                positions.push(pos);

                count ++;
                if (count == numVideos) {
                    break;
                }
            }
        } 

        // For incomplete grids, the bottom video(s) needs to be centered
        if (numVideos == 3) {
            positions[2].left += videoWidth/2;
        } else if (numVideos == 5) {
            positions[3].left += videoWidth/2;
            positions[4].left += videoWidth/2;
        }

    } else {
        var pos  = {};
        pos.top = offsetH;
        pos.left = offsetW;
        pos.height = videoHeight * rows;;
        pos.width = (cols > 1) ? videoWidth * (cols - 1) : videoWidth;
        positions.push(pos);

        for (var m = 1; m < numVideos; m++) {
            var pos = {};
            pos.top = (m - 1) * videoHeight + offsetH;
            pos.left = videoWidth * (cols - 1) + offsetW;
            pos.height = videoHeight;
            pos.width = videoWidth;
            positions.push(pos);
        }

    }

    return positions;
};


var setVideoPosition = function(elem, position) {
    elem.style.top = position.top + "px";
    elem.style.height = position.height + "px";
    elem.style.left = position.left + "px";
    elem.style.width = position.width + "px";
};



var lastCancelFunction = null;

var getQueryVariables = function() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var resp = {};
    for (var i = 0;i < vars.length;i++) {
        var pair = vars[i].split("=");
        resp[pair[0]] = pair[1];
    } 
    return resp;
};

var q = getQueryVariables();

var g = function(i) {
    var e = document.getElementById(i);
    if (!e) console.error("INVALID ELEMENT " + i);
     return e;
};

var setDisplay = function(elem, disp) {
    var e = document.getElementById(elem);
    if (e) {
        e.style.display = disp;
    }
};

var showModal = function(i) {
    var d = g(i);
    if (d.className.indexOf("modal-show") === -1) {
        d.className = d.className + " modal-show";
    }
};

var hideModal = function(i) {
    var d = g(i);
    var c = d.className.replace(/ *modal-show */, " "); // Remove modal-show from the list of classes
    d.className = c;
};

var sound = document.createElement("audio");
sound.preload = true;
sound.src = "images/s.ogg";

var playSound = function() {
    sound.currentTime = 0.0;
    sound.play();
};

function ConferenceModal(c) {
    var self = this;
    self.client_ = c;
    self.action_ = ""; // Can be ADD, MODIFY or DELETE
    g("conferenceModalDiv").style.width = "300px";
    g("conferenceModal").style.display = "block";
    g("conferenceModalClose").addEventListener("click", self.hide);
    // g("conferenceModalOK").addEventListener("click", self.handleOK.bind(self));
    g("conferenceModalDelete").addEventListener("click", self.handleDelete.bind(self));
    g("conferenceModalForm").onsubmit = function(e) {
        e.preventDefault();
        self.handleOK();
    };
}

ConferenceModal.prototype.getConf = function() {
    var conf = {
        id: this.id_,
        name: g("conferenceModalName").value,
        autoRecord: g("conferenceModalRecord").checked,
        maxBitrateKbps: g("conferenceModalBandwidth").value,
        maxParticipants: g("conferenceModalParticipants").value,
        mode: g("conferenceModalMode").checked ? "presenter" : "group"
    };

    return conf;
};

ConferenceModal.prototype.handleDelete = function(e) {
    if (window.confirm("Delete this conference ?")) {
        this.action_ = "DELETE";
    } else {
        e.preventDefault();
    }
};

ConferenceModal.prototype.handleOK = function() {
    switch(this.action_) {
        case "ADD":
            this.client_.addConference(this.getConf(), function(m) {
                alert("Conference " + m.conf.name + " add status - " + m.status + " conf id - " + m.conf.id);
            });
        break;
    
        case "EDIT":
            this.client_.modifyConference(this.getConf(), function(m) {
                alert("Conference " + g("conferenceModalName").value + " modify status - "  + m.status);
            });
        break;

        case "DELETE":
            this.client_.deleteConference(this.getConf(), function(m) {
                alert("Conference " + g("conferenceModalName").value + " delete status - "  + m.status);
            });
        break;

        default:
            console.error("UNHANDLED ACTION IN CONFERENCE MODAL - " + this.action_);
        break;
    }
    this.id_ = undefined;
    this.hide();
};

ConferenceModal.prototype.setAction = function(a) {
    this.action_ = a;
};

ConferenceModal.prototype.setTitle = function(t) {
    g("conferenceModalHeader").innerHTML = t;
};

ConferenceModal.prototype.setConf = function(conf) {
    g("conferenceModalName").value = conf.hasOwnProperty("name") ? conf.name : ""
    g("conferenceModalRecord").checked = conf.hasOwnProperty("autoRecord") ? conf.autoRecord : false;
    g("conferenceModalBandwidth").value = conf.hasOwnProperty("maxBitrateKbps") ? conf.maxBitrateKbps : "auto";
    g("conferenceModalParticipants").value  = conf.hasOwnProperty("maxParticipants") ? conf.maxParticipants : "2";
    var presenter = false;
    if (conf.hasOwnProperty("mode") &&  conf.mode === "presenter") {
        presenter = true;
    }
    g("conferenceModalMode").checked = presenter;
};


ConferenceModal.prototype.setButton = function(t) {
    g("conferenceModalOK").innerHTML = t;
};

ConferenceModal.prototype.showHideDelete = function(t) {
    if (t) {
        g("conferenceModalDelete").style.display = "inline-block";
    } else {
        g("conferenceModalDelete").style.display = "none";
    }
};

ConferenceModal.prototype.show = function() {
    showModal("conferenceModal");
};

ConferenceModal.prototype.hide = function() {
    hideModal("conferenceModal");
};

ConferenceModal.prototype.showAddConference = function() {
    this.setTitle("Add Conference");
    this.setConf({});
    this.setButton("ADD");
    this.setAction("ADD");
    this.showHideDelete(false);
    this.show();
};

ConferenceModal.prototype.showEditConference = function(conf) {
    this.id_ = conf.id;
    this.setTitle("Edit Conference");
    this.setConf(conf);
    this.setButton("SAVE");
    this.setAction("EDIT");
    this.showHideDelete(true);
    this.show();
};


function App(guest) {
    this.guest_ = guest;
    //this.client_ = new WebRtcClient(window.location.hostname, this.eventHandler.bind(this));
    this.client_ = new WebRtcClient("nstl.socialvid.in", this.eventHandler.bind(this));

    this.client_.setCanvases(g("mainFormCanvas"), g("mainFormCanvas2"));

    this.remoteStream_ = [];
    var self = this;
    window.addEventListener("message", self.messageHandler.bind(self), false);
    this.presenting_ = false;
    this.recording_ = false;
    this.shareName_ = "";
    this.selfView_ = true;
    this.talkerList_ = [];
    this.names_ = [];
    this.activeTalkerId_ = "";
    this.positions_ = [];
    this.grid_ = false;
    this.captions_ = false;
    this.shape_ = "pencil";
    this.selectUnselectBtn(this.shape_, false);
    this.wnd_ = [];
    this.maxDisplays_ = 6;
    this.callTimer_ = null;
    this.callTime_ = 0;

    if (!guest) {
        this.conferenceModal_ = new ConferenceModal(this.client_);
    }

};

App.prototype.reset = function() {
    this.localStream_ = null;
    this.remoteStream_.length = 0; 
    this.presenting_ = false;
    this.recording_ = false;
    this.shareName_ = "";
    this.selfView_ = true;
    this.hideVideo();
    this.talkerList_.length = 0; 
    this.names_.length = 0;
    this.activeTalkerId_ = "";
    this.positions_.length = 0;

    for (var i = 0; i < this.wnd_.length; i++) {
        this.wnd_[i].close();
    }

    this.wnd_.length = 0;
    this.grid_ = false;
    this.captions_ = false;
    g("mainFormRemoteCaption").style.display = "none";

    var btn = g("mainFormVideoBtn");
    btn.className = btn.className.replace("video-mute", "video-unmute");

    btn = g("mainFormMicrophoneBtn");
    btn.className = btn.className.replace("mic-mute", "mic-unmute");

    btn = g("mainFormSpeakerBtn");
    btn.className = btn.className.replace("speaker-mute", "speaker-unmute");

    g("mainFormRecordBtn").style.opacity = 0.5;
    g("mainFormShareBtn").style.opacity = 0.5;
    g("mainFormDisplaysBtn").style.display = "inline-block";
    g("mainFormShareBtn").style.display = "inline-block";
    g("mainFormRaiseHandBtn").style.opacity = 0.5;
    g("mainFormRaiseHandBtn").style.display = "none";

    this.hideShareVideo();

    if (this.guest_) {
        g("mainDiv").style.display = "none";
        g("signInDiv").style.display = "block";
    } else {
        this.hideIncomingCall();
        this.hideMakeCall();
    }

    if (this.callTimer_) {
        clearInterval(this.callTimer_);
        this.callTimer_ = null;
    }
    this.callTime_ = 0;
    g("mainFormRemoteVideo1").src = "";
    g("mainFormRecordInd").style.display = "none";

    // Hide the mute icons
    g("mainFormSelfVideoMuteImg").style.display = "none";
    g("mainFormRemoteVideoMuteImg").style.display = "none";

    // Reset the layout
    g("mainFormShareName").innerHTML = "";
    setVideoPosition(g("mainFormShareVideo"), {top: 0, left: 0, height: 0, width: 0});
    for (i = 1; i <= this.maxDisplays_; i++) {
        var elem = g("mainFormVideo"+i);
        setVideoPosition(elem, {top: 0, left: 0, height: 0, width: 0});
        g("mainFormRemotePart" + i).innerHTML = "";
    }

    g("mainFormConferenceMode").innerHTML = "";
    g("mainFormParticipantsList").innerHTML = "";

};

var alog = function(msg) {
    console.log(new Date().toISOString() + " - App: ",  msg);
};

App.prototype.getDevices = function(cb) {
    this.client_.getDevices(cb);
};

App.prototype.dialout = function(number, name, callback) {
    var req = new XMLHttpRequest();
    var url = "/adminapi/v1/custom/dialout";
    var params = {
        number: number,
        name: name,
        id: q.conferenceId
    };

    var self = this;
    self.showModal("Requesting call...");
    req.open("POST", url, true);
    req.onload = function() {
        alog("dialout response = " + req.status + " " + req.statusText + " " + req.responseText);
        if (req.status !== 200) {
            self.showModal("Dialout failed " + req.statusText);
            callback(false);
        } else {
            self.showModal("Dialout successful ");
            callback(true);
        }
    };

    req.send(JSON.stringify(params));
    alog("Dialout - number=" + number + " name=" + name);
};

App.prototype.messageHandler = function(evt) {
    if (evt.origin !== window.location.origin) {
        return;
    }

    var msg = evt.data;
    alog("MsgHandler: " + JSON.stringify(msg));

    switch (msg.type) {
        case "windowOpened":
            var src = URL.createObjectURL(this.remoteStream_[msg.videoNo]);
            // this.hideVideo();
            this.wnd_[msg.videoNo-1].postMessage({type: "remoteStream", video: src, name: this.names_[msg.videoNo-1]}, window.location.origin);
        break;

        case "windowClosed":
            // this.showVideo({index: msg.videoNo, id: "Tada", stream: this.remoteStream_[msg.videoNo]});
        break;
    }
};

App.prototype.eventHandler = function(evt) {
    alog("Event: " + JSON.stringify(evt));
    switch(evt.type) {
        case "voiceCallRequest":
            this.showIncomingCall(evt.id, "Voice", evt.name);
        break;

        case "videoCallRequest":
            this.showIncomingCall(evt.id, "Video", evt.name);
        break;

        case "callAnswered":
            this.hideIncomingCall();
            break;

        case "disconnectCallRequest":
            this.hideIncomingCall();
            this.showModal("Missed call from " + g("callModal").dataset.username, true, true, "OK");
            break;

        case "contactUpdated":
           var c = g(evt.id);
           if (c) {
               c.getElementsByClassName("contact-status")[0].innerHTML = (evt.status); 
           }
        break;

        case "conferenceUpdated":
           g(evt.id).getElementsByClassName("conference-status")[0].innerHTML = (evt.status); 
        break;

        case "recordingsUpdated":
            g("mainFormRecordingsBody").innerHTML = "";
            this.fetchRecordings();
        break;

        case "conferencesUpdated":
            g("mainFormContactsList").innerHTML = "";
            g("mainFormConferencesList").innerHTML = "";
            g("mainFormConferencesBody").innerHTML = "";
            this.fetchContactsAndRecordings(false); // Only update conferences and contacts
            break;

        case "userJoined":
            this.showModal("" + evt.userName + " joined your conference room \"" + evt.confName + "\"", true, false, "");
        break;

        case "userLeft":
            this.showModal("" + evt.userName + " left your conference room \"" + evt.confName + "\"", true, false, "");
        break;

        case "connectionClosed":
            this.showModal("Connection to Server lost", true, false, "");
            this.reset();
            g("mainFormContactsList").innerHTML = "";
            g("mainFormConferencesList").innerHTML = "";
            g("mainFormConferencesBody").innerHTML = "";
            g("mainFormRecordingsBody").innerHTML = "";

            g("mainDiv").style.display = "none";
            g("signInDiv").style.display = "block";
        break;
        
    }
};



App.prototype.showModal = function(text, closeBtn, cancelBtn, cancelTxt, cancelFn) {
    var self = this;
    alog("showModal - " + text);

    var modal = g("genericModal");
    if (modal.className.indexOf("modal-show") !== -1) {
        var appendedTxt = g("genericModalText").innerHTML + "<br><hr>" + text;
        g("genericModalText").innerHTML = appendedTxt;
    } else {
        g("genericModalText").innerHTML = text;
    }
    if (closeBtn) {
        g("genericModalClose").style.display = "block";
    } else {
        g("genericModalClose").style.display = "none";
    }

    if (lastCancelFunction) {
        g("genericModalCancel").removeEventListener("click", lastCancelFunction);
    }

    if (cancelBtn) {
        g("genericModalCancel").innerHTML = cancelTxt;
        if (cancelFn) {
            lastCancelFunction = cancelFn;
            g("genericModalCancel").addEventListener("click", cancelFn);
        } else {
            lastCancelFunction = self.hideGenericModal.bind(self);
            g("genericModalCancel").addEventListener("click", lastCancelFunction);
        }

        g("genericModalCancel").style.display = "inline-block";
        g("genericModalFooter").style.display = "block";
    } else {
        g("genericModalCancel").style.display = "none";
        g("genericModalFooter").style.display = "none";
    }
    showModal("genericModal");

};

App.prototype.hideGenericModal = function() {
    hideModal("genericModal");
};


App.prototype.addContacts = function(contacts) {
    var self = this;
    var contactClick = function(e) {
        self.contactClicked(this);
    };
    var conferenceClick = function(e) {
        console.dir(e);
        self.conferenceClicked(this);
    };

    var conferenceRowClick = function(e) {
        console.dir(e);
        self.conferenceClicked(g(e.target.dataset.id));
    };

    var editConference = function(e) {
        var d = e.target.dataset;
        var conf = {
            id: d.id,
            name: d.name,
            autoRecord: d.autoRecord === "true" ? true : false,
            maxBitrateKbps: d.maxBitrateKbps,
            mode: d.mode
        };
        self.conferenceModal_.showEditConference(conf);
    };

    var contactsList = g("mainFormContactsList");
    var conferencesList = g("mainFormConferencesList");
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].type === "user") {
            var li = document.createElement("li");
            li.id = contacts[i].id;
            li.className = "contact";
            var div = "<p class=\"contact-name list-name\">";
            div += contacts[i].name;
            div += "</p>";
            div += "<p class=\"contact-status list-status\">";
            div += contacts[i].status;
            div += "</p>"
            li.innerHTML = div;
            li.addEventListener("click", contactClick);
            contactsList.appendChild(li);
        } else if (contacts[i].type === "self") {
            var row = document.createElement("tr");

            var tr = "<td>" + "Direct Call"  + "</td>";
            tr += "<td>" + window.location.protocol + "//" + window.location.hostname + "/guest.html?userId=" + contacts[i].id + "</td>";
            tr += "<td colspan=6 style=\"height: 45px;\">" + "Use this link for direct guest calling" + "</td>";

            row.innerHTML = tr;

            g("mainFormConferencesBody").appendChild(row);
        } else {
            if (this.id_.indexOf(contacts[i].userId) === -1) {
                var li = document.createElement("li");
                li.id = contacts[i].id;
                li.className = "conference";
                var div = "<p class=\"conference-name list-name\">";
                div += contacts[i].name;
                div += "</p>";
                div += "<p class=\"conference-status list-status\">";
                div += contacts[i].status;
                div += "</p>";
                li.innerHTML = div;
                li.addEventListener("click", conferenceClick);
                conferencesList.appendChild(li);
            } else {
                var row = document.createElement("tr");
                row.id  = contacts[i].id;
                // row.className = "conference";

                var tr = "<td class=\"conference-name\">" + contacts[i].name + "</td>";
                tr += "<td>" + window.location.protocol + "//" + window.location.hostname + "/guest.html?conferenceId=" + contacts[i].id + "</td>";
                tr += "<td class=\"conference-status\">" + contacts[i].status + "</td>";
                tr += "<td>" + contacts[i].maxParticipants + "</td>";

                if (contacts[i].maxBitrateKbps !== "auto") {
                    tr += "<td>" + contacts[i].maxBitrateKbps + " kbps </td>";
                } else {
                    tr += "<td> Auto </td>";
                }

                if (contacts[i].autoRecord) {
                    tr += "<td><div class=\"yes showicon\"></div></td>"
                } else {
                    tr += "<td><div class=\"no showicon\"></div></td>"
                }

                if (contacts[i].mode === "group") {
                    tr += "<td><div class=\"group-mode showicon\"></div></td>"
                } else {
                    tr += "<td><div class=\"presenter-mode showicon\"></div></td>"
                }

                tr += "<td>" + "<button class=\"voice-call\"></button>" + "</td>";
                tr += "<td>" + "<button class=\"edit\"></button>" + "</td>";

                row.innerHTML = tr;

                var btns = row.getElementsByTagName("button");
                btns[0].dataset.id = contacts[i].id;
                btns[0].onclick = conferenceRowClick;

                btns[1].dataset.id = contacts[i].id;
                btns[1].dataset.name = contacts[i].name;
                btns[1].dataset.autoRecord = contacts[i].autoRecord;
                btns[1].dataset.maxBitrateKbps = contacts[i].maxBitrateKbps;
                btns[1].onclick = editConference;

                // row.addEventListener("click", conferenceClick);
                g("mainFormConferencesBody").appendChild(row);
                // $("#mainFormConferencesBody").append(tr);
            }
        }
    }
};

App.prototype.contactClicked = function(obj) {
    console.dir(obj);
    var name = g(obj.id).getElementsByClassName("contact-name")[0].innerHTML;
    alog("Name is " + name);
    this.showMakeCall(obj.id, name, "Call ", "call");
};

App.prototype.conferenceClicked = function(obj) {
    console.dir(obj);
    var name = g(obj.id).getElementsByClassName("conference-name")[0].innerHTML;
    alog("Name is " + name);
    this.showMakeCall(obj.id, name, "Join Conference - ", "conference");
};

App.prototype.showAddConference = function() {
    this.conferenceModal_.showAddConference();
};

App.prototype.addRecordings = function(r) {
    var viewRecording = function(e) {
        var t = "/player.html?video=" + e.target.dataset.path; 
        window.open(t, "_blank");
    };
    
    var deleteRecording = function(e) {
        if (window.confirm("Delete this recording ?")) {
            self.client_.deleteRecording(e.target.dataset.path); 
        }
    };

    var self = this;
    for (var i = 0; i < r.length; i++) {
        var row = document.createElement("tr");
        var d = new Date(r[i].startTime);
        var link = window.location.protocol + "//" + window.location.hostname + "/player.html?video=" + r[i].path; 
        var tr = "<td class=\"conference-name\">" + r[i].confName + "</td>";
        tr += "<td>" + d.toLocaleString() + "</td>";
        tr += "<td>" + link + "</td>";
        tr += "<td>" + "<button class=\"view\"></button>" + "</td>";
        tr += "<td>" + "<button class=\"delete\"></button>" + "</td>";

        row.innerHTML = tr;

        var btns = row.getElementsByTagName("button");
        btns[0].dataset.path = r[i].path;
        btns[0].onclick = viewRecording;

        btns[1].dataset.path = r[i].path;
        btns[1].onclick = deleteRecording;

        g("mainFormRecordingsBody").appendChild(row);
    }
};

App.prototype.setVideoTitle = function(title) {
    g("mainFormTitle").innerHTML = title;
    g("mainFormTime").innerHTML = "( 00:00 )";
};

App.prototype.updateCallTime = function() {
    this.callTime_ += 1;

    var minutes = Math.floor(this.callTime_ / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var seconds = this.callTime_ % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var hours = Math.floor(minutes / 60);

    var time = (hours > 0 ? "" + hours + ":" : "");
    time += (minutes + ":" + seconds); 
    // this.log("CallTime: " + time);
    g("mainFormTime").innerHTML = " ( " + time + " )";
};

App.prototype.showMakeCall = function(id, username, text, callOrConference) {
    g("callModalText").innerHTML = (text + " " + username);

    g("callModal").dataset.userid = id;
    g("callModal").dataset.username = username;
    g("callModal").dataset.callOrConference = callOrConference;

    loadDevices(this, function() {
        showModal("callModal");
    });
};

App.prototype.hideMakeCall = function() {
    hideModal("callModal");
};


App.prototype.showIncomingCall = function(id, type, username) {
    g("incomingCallModalText").innerHTML = ("Incoming " + type + " Call from " + username);
    g("incomingCallModal").dataset.callType =  type;
    g("incomingCallModal").dataset.userid = id;
    g("callModal").dataset.username = username;
    g("callModal").dataset.callOrConference = "call";
    g("callModal").dataset.callType = type;

    showModal("incomingCallModal");
    this.setVideoTitle(username);
};

App.prototype.hideIncomingCall = function() {
    hideModal("incomingCallModal");
};

App.prototype.rejectCall = function() {
    alog("Reject Call called");
    this.client_.rejectCall();
    this.hideIncomingCall();
};


App.prototype.ignoreCall = function() {
    alog("Ignore Call called");
    this.client_.ignoreCall();
    this.hideIncomingCall();
};

App.prototype.answerCall = function() {
    var self = this;
    alog("Answer Call called");
    self.hideIncomingCall();
    self.showModal("Call Proceeding...", false, true, "HANG UP", self.hangup.bind(self));
    self.client_.answerCall(g("incomingCallModal").dataset.callType, self.callCallback.bind(self));
};

App.prototype.showHideSelfView = function() {
    var sv = g("mainFormSelfView");
    /**
    if (!this.selfView_) {
        setVideoPosition(sv, {top: 0, left: 0, height: 0, width: 0});
        // sv.style.display = "none";
        return;
    }

    **/
    var container = g("mainFormVideosContainer");
    var w = container.clientWidth;
    var h = container.clientHeight;

    if (!this.selfView_) {
        setVideoPosition(sv, {top: h, left: w, height: 0, width: 0});
        // sv.style.display = "none";
        return;
    }


    var top = Math.floor(h * 0.70);
    var height = h - top;

    var width = Math.floor((height * ASPECT_WIDTH) / ASPECT_HEIGHT);
    var left = w - width;

    sv.style.display = "block";
    setVideoPosition(sv, {top: top, left: left, width: width, height: height});
};

App.prototype.setupForVideo = function() {
    alog("Setting up for video max=" + this.maxDisplays_ + "  current=" + this.currentDisplays_); 

    var isCall = (g("callModal").dataset.callOrConference === "call");

    var sel = g("mainFormDisplaysBtn");

    var l = sel.length;
    for (var j = 0; j < l; j++) {
        sel.remove(0);
    }

    var opt;
    for (var k = 0; k < this.maxDisplays_; k++) {
        opt = document.createElement("option");
        opt.value = k + 1;
        opt.text = k + 1;
        sel.add(opt);
    }

    sel.selectedIndex = this.currentDisplays_-1;

    // this.hideGenericModal();
    setDisplay("mainFormConferencesAndRecordings", "none");

    this.callTimer_ = setInterval(this.updateCallTime.bind(this), 1000);
    this.videoLayout(this.talkerList_, this.names_);

    if (isCall) {
        if (!this.guest_) {
            g("mainFormTransferBtn").style.display = "inline-block";
        } else {
            g("mainFormTransferBtn").style.display = "none";
        }

        g("mainFormDisplaysBtn").style.display = "none";
        g("mainFormRecordBtn").style.display = "none";
        g("mainFormLayoutBtn").style.display = "none";
        // g("mainFormRaiseHandBtn").style.display = "none";
        g("mainFormParticipants").style.display = "none";
    } else {
        if (this.guest_) {
            g("mainFormRecordBtn").style.display = "none";
        } else {
            g("mainFormRecordBtn").style.display = "inline-block";
        }
        g("mainFormTransferBtn").style.display = "none";

        if (g("callModal").dataset.callType !== "Share") {
            g("mainFormLayoutBtn").style.display = "inline-block";
        }
        setDisplay("mainFormConferencesAndRecordings", "none");
        setDisplay("mainFormcontactsAndConferences", "none");
        g("mainFormParticipants").style.display = "block";
    }


    var callType = g("callModal").dataset.callType;
    var btn = g("mainFormVideoBtn");
    if (callType === "Voice") {
        btn.className = btn.className.replace("video-unmute", "video-mute");
    } else {
        btn.className = btn.className.replace("video-mute", "video-unmute");
    }

    // Just for the proper animation
    setVideoPosition(g("mainFormSelfView"), {top: screen.height, left: screen.width, height: 0, width: 0});

    g("mainFormVideos").style.display = "block"; 

    this.showHideSelfView();
};

App.prototype.showVideo = function(msg) {
    alog("Remote Stream Index: " + msg.index + " id: " + msg.id + " label: " + msg.label);
    var videoElem = g("mainFormRemoteVideo" + msg.index);

    if (videoElem) {

        videoElem.src = "";

        // TODO UNCOMMENT WHEN YOU GET PROPER STREAMS ON ALL IDS
        this.remoteStream_[msg.index] = msg.stream;
        // this.remoteStream_[msg.index] = this.remoteStream_[0];
        attachMediaStream(videoElem, msg.stream);

        // Display the first stream by default...
        if (msg.index === 1) {
            g("mainFormVideo" + msg.index).style.display = "block"; 
        }

        //this.videoLayout([1], this.names_);
    }
};

App.prototype.hideVideo = function() {
    for (var k = 1; k <= this.maxDisplays_; ++k) {
        g("mainFormVideo" + k).style.display = "none"; 
        g("mainFormRemoteVideo" + k).src = "";
    }
    g("mainFormVideos").style.display = "none"; 
    this.closeChat();
    this.clearChat();
    setDisplay("mainFormcontactsAndConferences", "block");
    setDisplay("mainFormConferencesAndRecordings", "block");
    g("mainFormParticipants").style.display = "none";
};


App.prototype.fetchContactsAndRecordings = function(fetchRecording) {
    var self = this;
    self.showModal("Fetching contacts...", false, false, ""); 

    self.client_.getContacts(function(contacts) {
        self.addContacts(contacts);
        if (fetchRecording) {
            self.fetchRecordings();
        } else {
            self.hideGenericModal();
        }
    });
};

App.prototype.fetchRecordings = function() {
    var self = this;
    self.showModal("Fetching recordings...", false, false, ""); 

    self.client_.getRecordings(function(recordings) {
        self.addRecordings(recordings);
        self.hideGenericModal();
    });
};

App.prototype.login = function() {
    var self = this;

    var cb = self.callCallback.bind(self);

    if (self.guest_) {
        var guestName = g("inputText").value;
        var callType = g("callModal").dataset.callType;
        if (q.hasOwnProperty("conferenceId")) {
            self.showModal("Joining the conference...");
            g("callModal").dataset.callOrConference = "conference";
            // g("callModal").dataset.callType = "Video";
            self.client_.guestLogin(guestName, q["conferenceId"], function(loginStatus) {
                if (loginStatus.status === 0) {
                    self.maxDisplays_ = loginStatus.maxDisplays;
                    self.currentDisplays_ = loginStatus.currentDisplays;
                    g("signInDiv").style.display = "none";
                    g("mainDiv").style.display = "block";
                    // $("#mainFormSelfName").text("Welcome " + loginStatus.name);
                    self.id_ = loginStatus.id;

                    self.client_.setCamera(g("inputCamera").value);
                    self.client_.setMicrophone(g("inputMic").value);

                    self.hideGenericModal();
                    self.showModal("Making " + callType + " call to " + loginStatus.confName + "...", false, true, "HANG UP", self.hangup.bind(self));
                    self.setVideoTitle(loginStatus.confName);
                    if (callType === "Voice") {
                        self.client_.joinVoiceConference(q["conferenceId"], cb);
                    } else if (callType === "Video") {
                        self.client_.joinVideoConference(q["conferenceId"], cb);
                    } else if (callType === "Share") {
                        self.selfView_ = false;
                        self.client_.joinShareConference(q["conferenceId"], cb);
                    }

                } else {                                                                                                      
                    self.hideGenericModal();
                    self.showModal("Failed - " + loginStatus.status, true, false, "");
                }
            });
        } else if (q.hasOwnProperty("userId")) {
            g("callModal").dataset.callOrConference = "call";
            self.client_.createGuestUser(guestName, function(loginStatus) {
                if (loginStatus.status !== 0) {
                    self.showModal("Failed - " + loginStatus.status, true, false, "");
                    return;
                }
                self.maxDisplays_ = loginStatus.maxDisplays;
                self.currentDisplays_ = loginStatus.currentDisplays;
                g("signInDiv").style.display = "none";
                g("mainDiv").style.display = "block";
                self.id_ = loginStatus.id;
                self.client_.joinGuestRoom(q["userId"], callType, cb);
            });
        } else {
            g("callModal").dataset.callOrConference = "call";
            // g("callModal").dataset.callType = "Video";
            // this.showModal("No conference");
            self.client_.createGuestUser(guestName, function(loginStatus) {
                if (loginStatus.status !== 0) {
                    self.showModal("Failed - " + loginStatus.status, true, false, "");
                    return;
                }
                self.maxDisplays_ = loginStatus.maxDisplays;
                self.currentDisplays_ = loginStatus.currentDisplays;
                g("signInDiv").style.display = "none";
                g("mainDiv").style.display = "block";
                self.id_ = loginStatus.id;

                g("callModal").dataset.username = guestName;
                self.client_.waitInGuestRoom(cb);
                self.setupForVideo();

                var html = "Copy and send this link to invite (Press Ctrl+C / Cmd+C) <br> <br> ";
                var url = "" + window.location.protocol + "//" + window.location.hostname + "/guest.html?userId=" + self.id_;
                html += "<input type=\"text\" id=\"modalTextBox\" value=\"" + url + "\">";
                self.showModal(html);

                g("modalTextBox").select();
            });
        }
        return;
    }

    var email = g("inputEmail").value;
    var passwd = g("inputPassword").value;

    self.showModal("Logging in...", false, false, "");

    if (g("inputRememberMe").checked) {
        window.localStorage["email"] = email;
        window.localStorage["passwd"] = passwd;
    }

    self.client_.login(email, passwd, function(loginStatus) {
        if (loginStatus.status === 0) {
            self.maxDisplays_ = loginStatus.maxDisplays;
            self.currentDisplays_ = loginStatus.currentDisplays;
            g("signInDiv").style.display = "none";
            g("mainDiv").style.display = "block";
            // $("#mainFormSelfName").text("Welcome " + loginStatus.name);
            self.id_ = loginStatus.id;
            self.fetchContactsAndRecordings(true); // fetch recordings as well
        } else {                                                                                                      
            self.hideGenericModal();                                                                                         
            self.showModal("Login failed - " + loginStatus.status, true, false, "");
        }
    });
};

App.prototype.participantClickedInConference = function(e) { // the click sometimes comes on the li and sometimes on the p
    var n = e.target;
    if (e.target.className.indexOf("list-name") === -1) { 
        n = e.target.getElementsByClassName("list-name")[0];
    }

    if (n.className.indexOf(" handraised") !== -1) { // hand raised - allow or disallow
        if (window.confirm("Allow " + n.innerHTML + " to speak ?")) {
            this.client_.acknowledgeRaisedHand(n.dataset.id, true);
            n.className = n.className.replace(" handraised", " handallowed");
        } else {
            this.client_.acknowledgeRaisedHand(n.dataset.id, false);
            n.className = n.className.replace(" handraised", " nospeaker");
        } 
    } else if (n.className.indexOf(" handallowed") !== -1) { // hand allowed, continue or stop
        if (window.confirm("Disable " + n.innerHTML + " ?")) {
            this.client_.acknowledgeRaisedHand(n.dataset.id, false);
            n.className = n.className.replace(" handallowed", " nospeaker");
        }
    }
};

App.prototype.callCallback = function(resp) {
    var self = this;
    var isCall = false;
    var isVoice = false;
    var userName;
    var btn;

    var c = g("callModal");
    userName = c.dataset.username;
    isCall = c.dataset.callOrConference === "call";
    isVoice = c.dataset.callType === "Voice";

    switch(resp.type) {
        case "userUnavailableResponse":
            if (this.guest_) {
                self.reset();
                self.showModal("Invalid guest room...", true, true, "OK");
            } else {
                self.showModal("User Unavailable", true, true, "OK");
            }
            break;

        case "callProceeding":
            self.showModal("Call Proceeding...", false, true, "HANG UP", self.hangup.bind(self));
            break;

        case "rejectCallResponse":
            self.showModal("Call Rejected...", true, true, "OK");
            self.reset();
            break;

        case "ignoreCallResponse":
            self.showModal("Call Ignored...", true, true, "OK");
            self.reset();
            break;

        case "videoConfResponse":
            if (resp.status !== 0) {
                self.showModal("Conference full", true, true, "OK");
                self.reset();
            } 
            break;

        case "licenseStatus":
            self.reset();
            self.showModal("License check failed - " + resp.status, true, true, "OK");
            break;

        case "disconnectConfResponse":
            self.reset();
            self.showModal("Call Disconnected", true, true, "OK");
            break;

        case "getUserMediaFailed":
            self.reset();
            self.showModal("Camera/Microphone access failed - " + resp.error.name, true, true, "OK");
            break;

        case "mainCandidateGatheringError":
            self.reset();
            self.showModal("Failed to gather ICE candidates, please restart browser and try again", true, true, "OK");
            break;

        case "mainIceConnectionState":
            if (resp.state === "completed" || resp.state === "connected") {
                self.hideGenericModal();
            } else if (resp.state === "failed" || resp.state === "closed") {
                self.showModal("Media Connection state - " + resp.state, true, true, "OK");
            } else {
                self.showModal("Media Connection state - " + resp.state, false, true, "HANG UP", self.hangup.bind(self));
            }
            break;

        case "acceptCallResponse":
            self.showModal("Collecting Capabilities...", false, true, "HANG UP", self.hangup.bind(self));
            break;

        case "remoteGuestUser":
            self.hideGenericModal();
            self.showModal("\"" + resp.guestName +"\" joined");
            g("callModal").dataset.username = resp.guestName;
            self.setVideoTitle(resp.guestName);
            break;

        case "offerSdp":
        // case "answerSdp":
            self.showModal("Negotiating Capabilities...", false, true, "HANG UP", self.hangup.bind(self));
            break;

        case "remoteAudioStream":
            var audioElem = g("mainFormAudio1");
            attachMediaStream(audioElem, resp.stream);
            if (typeof audioElem.setSinkId === "function") {
                var id = g("outputSpeaker").value;
                alog("Setting audio output to " + id);
                audioElem.setSinkId(id);
            }
            if (isCall) {
                self.setupForVideo();
                self.names_ = [userName];
                self.talkerList_ = [0]; // Video Number for audio only call is 0
                self.videoLayout(self.talkerList_, self.names_);
            }
            break;

        case "remoteStream":

            if (resp.index === 1) {
                // self.showModal("Starting Media...", false, true, "HANG UP", self.hangup.bind(self)); 
                self.setupForVideo();
            }

            self.showVideo(resp);
            if (isCall) {
                // g("mainFormRemotePart1").innerHTML = (userName);
                self.names_ = [userName];
                self.talkerList_ = [1];
            }

            // active talker list came before remoteStream
            // layout calculation fails because container is hidden and the container height and width is 0
            if (self.names_.length > 0) {
                self.videoLayout(self.talkerList_, self.names_);
            }

            break;

        case "localStream":
            var l = g("mainFormSelfVideo");
            l.src = "";

            self.localStream_ = resp.stream;
            attachMediaStream(g("mainFormSelfVideo"), resp.stream);
            break;

        case "userFilesTransferRequest":
        case "confFilesTransferRequest":
            this.downloadFile(resp.files);
            break;

        case "userChatMessage":
        case "confChatMessage":
            this.openChat();
            this.addChat(resp.chat, resp.name);
            break;

        case "remoteShareStream":
            attachMediaStream(g("mainFormShareVideo1"), resp.stream);
            this.showShareVideo(resp.shareName);
            break;

        case "userStopShare":
        case "confStopShare":
            this.hideShareVideo();
            break;

        case "userAudioMuted":
        case "userAudioUnmuted":
            break;

 
        case "userVideoMuted":
            g("mainFormRemoteVideoMuteImg").style.display = "block";
            break;

        case "userVideoUnmuted":
            g("mainFormRemoteVideoMuteImg").style.display = "none";
            break;



        case "confAudioForceMuted":
        case "userAudioForceMuted":
            btn = g("mainFormMicrophoneBtn");
            btn.className = btn.className.replace("mic-unmute", "mic-mute");
            btn.disabled = true;
            break;

        case "confAudioForceUnmuted":
        case "userAudioForceUnmuted":
            btn = g("mainFormMicrophoneBtn");
            btn.className = btn.className.replace("mic-mute", "mic-unmute");
            btn.disabled = false;
            break;

        case "confVideoForceMuted":
        case "userVideoForceMuted":
            btn = g("mainFormVideoBtn");
            btn.className = btn.className.replace("video-unmute", "video-mute");
            g("mainFormSelfVideoMuteImg").style.display = "block";
            btn.disabled = true;
            break;

        case "confVideoForceUnmuted":
        case "userVideoForceUnmuted":
            btn = g("mainFormVideoBtn");
            btn.className = btn.className.replace("video-mute", "video-unmute");
            g("mainFormSelfVideoMuteImg").style.display = "none";
            btn.disabled = false;
            break;

        case "confModeChanged":
            switch (resp.mode) {
                case "groupModeParticipant":
                case "presenterModePresenter":
                    if (resp.mode === "groupModeParticipant") {
                        g("mainFormConferenceMode").innerHTML = "(GROUP MODE)";
                    } else {
                        g("mainFormConferenceMode").innerHTML = "(PRESENTER)";
                    }
                    btn = g("mainFormMicrophoneBtn");
                    btn.className = btn.className.replace("mic-mute", "mic-unmute");
                    btn.disabled = false;

                    g("mainFormRaiseHandBtn").style.display = "none";
                    g("mainFormDisplaysBtn").style.display = "inline-block";
                    g("mainFormShareBtn").style.display = "inline-block";
                    break;
                    
                case "presenterModeParticipant":
                    g("mainFormConferenceMode").innerHTML = "(LISTENER)";
                    btn = g("mainFormMicrophoneBtn");
                    btn.className = btn.className.replace("mic-unmute", "mic-mute");
                    btn.disabled = true;

                    g("mainFormRaiseHandBtn").style.display = "inline-block";
                    g("mainFormDisplaysBtn").style.display = "none";
                    g("mainFormShareBtn").style.display = "none";
                    break;
            }
            break;

        case "confParticipantHandRaised":
            this.setRaiseHand(resp.participant.name); 
            break;

        case "confRaiseHandResponse":
            if (resp.audioUnmuted) {
                btn = g("mainFormMicrophoneBtn");
                btn.className = btn.className.replace("mic-mute", "mic-unmute");
                btn.disabled = false;
            } else {
                btn = g("mainFormMicrophoneBtn");
                btn.className = btn.className.replace("mic-unmute", "mic-mute");
                btn.disabled = true;
            }
            g("mainFormRaiseHandBtn").style.opacity = 0.5;
            break;

        case "disconnectCallRequest":
            this.showModal("Call Disconnected...", true, true, "OK");
            this.reset();
        break;

        case "conferenceEnded":
            this.showModal("Conference ended...", true, true, "OK");
            this.reset();
            g("mainFormRemoteVideo1").src = "";
        break;

        case "userCaption":
        case "confCaption":
            var c = g("mainFormRemoteCaption");
            c.style.display = "block";
            c.innerHTML = resp.caption;
            break;

        case "activeTalkerList":
            var talkers = resp.talkers.map(function(a) { return a.videoNo; });
            var names = resp.talkers.map(function(b) { return b.name; });
            this.videoLayout(talkers, names);
            this.activeTalkerId_ = "" + resp.talkers[0].callId;
            this.setActiveTalker();
            break;

        case "callTransferInProgress":
            this.hideGenericModal();
            this.showModal("Transferring Call...", false, false, "");
            break;

        case "recordingStarted":
            g("mainFormRecordInd").style.display = "inline";
            break;

        case "recordingStopped":
            g("mainFormRecordInd").style.display = "none";
            break;

        case "participantsUpdated":
            var list = g("mainFormParticipantsList");
            if (list.innerHTML && list.innerHTML.length > 0) { // already list is there, now being updated, so play sound, first time list will be empty, so no sound to be played
                playSound();
                list.innerHTML = "";
            }
            for (var i = 0; i < resp.participants.length; i++) {
                var li = document.createElement("li");
                li.dataset.id = resp.participants[i].id;
                var cls = "list-name nospeaker";
                if (resp.participants[i].state === "presenterModeParticipantHandRaised") {
                    cls = "list-name handraised";
                } else if (this.activeTalkerId_ === resp.participants[i].id) {
                    cls = "list-name speaker";
                } 
                var div = "<p class=\"" + cls + "\">" + resp.participants[i].name + "</p>";
                if (resp.participants[i].callType === "Video") {
                    div += "<span class=\"video-call callicon\"></span>"
                } else {
                    div += "<span class=\"voice-call callicon\"></span>"
                }

                li.innerHTML = div;
                li.firstChild.dataset.id = resp.participants[i].id; // set on the p the participant id
                li.addEventListener("click", self.participantClickedInConference.bind(self));
                list.appendChild(li);
            } 
            self.arrangeParticipants();
            break;

        default:
            alog("UNHANDLED MESSAGE IN CALL CALLBACK " + resp.type);
            break;
    }
};

App.prototype.voiceCall = function() {
    var self = this;
    g("callModal").dataset.callType = "Voice";
    var id = g("callModal").dataset.userid;
    var name = g("callModal").dataset.username;
    var callOrConference = g("callModal").dataset.callOrConference;

    alog("Voice call - " + name + "  " + id);
    self.hideMakeCall();
    self.showModal("Making Voice call to " + name + "...", false, true, "HANG UP", self.hangup.bind(self));
    var cb = self.callCallback.bind(self);

    self.client_.setMicrophone(g("inputMic").value);

    if (callOrConference === "conference") {
        self.setVideoTitle(name);
        self.client_.joinVoiceConference(id, cb);
    } else {
        self.setVideoTitle(name);
        self.client_.makeVoiceCall(id, cb);
    }
};

App.prototype.videoCall = function() {
    var self = this;
    g("callModal").dataset.callType = "Video";
    var id = g("callModal").dataset.userid;
    var name = g("callModal").dataset.username;
    var callOrConference = g("callModal").dataset.callOrConference;

    alog("Video call - " + name + "  " + id);
    self.hideMakeCall();
    self.showModal("Making Video call to " + name + "...", false, true, "HANG UP", self.hangup.bind(self));
    var cb = self.callCallback.bind(self);

    self.client_.setCamera(g("inputCamera").value);
    self.client_.setMicrophone(g("inputMic").value);

    if (callOrConference === "conference") {
        self.setVideoTitle(name);
        self.client_.joinVideoConference(id, cb);
    } else {
        self.setVideoTitle(name);
        self.client_.makeVideoCall(id, cb);
    }
};

App.prototype.raiseHand = function(event) {
    g("mainFormRaiseHandBtn").style.opacity = 1.0;
    this.client_.raiseHand();
};

App.prototype.callTransfer = function(event) {
    this.client_.transferCall();
};

App.prototype.maxDisplays = function(event) {
    if(g("callModal").dataset.callOrConference === "call") {
        return;
    }

    var c = parseInt(g("mainFormDisplaysBtn").value, 10);
    var p = this.positions_; 
    var r = [];
    for (var i = 0; i < c; i++) {
        var w, h;
        if (p[i]) {
            w = p[i].width;
            h = p[i].height;
        } else {
            w = h = 0;
        }
        alog("W[" + (i+1) + "]   w=" + w + "  h=" + h);
        r.push({width: w, height: h});
    }
    this.client_.setCurrentDisplays(c, r);
};

App.prototype.record = function(event) {
    var self = this;
    if (self.recording_ === false) {
        self.recording_ = true;
        g("mainFormRecordBtn").style.opacity = 1.0;
        self.client_.startRecording();
    } else {
        g("mainFormRecordBtn").style.opacity = 0.5;
        self.client_.stopRecording();
        self.recording_ = false;
    }
};

App.prototype.selectUnselectBtn = function(shape, unselect) {
    if (unselect) {
        g("mainForm" + shape + "Btn").style.opacity = "0.5";
    } else {
        g("mainForm" + shape + "Btn").style.opacity = "1.0";
    }
};

App.prototype.selectColor = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.client_.setWhiteboardShape(this.shape_, c, w);
};


App.prototype.selectLineWidth = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.client_.setWhiteboardShape(this.shape_, c, w);
};

App.prototype.selectPencil = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "pencil";
    this.selectUnselectBtn(this.shape_, false);
    this.client_.setWhiteboardShape("pencil", c, w);
};

App.prototype.selectLine = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "line";
    this.selectUnselectBtn(this.shape_, false);
    this.client_.setWhiteboardShape("line", c, w);
};

App.prototype.selectRectangle = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "rectangle";
    this.selectUnselectBtn(this.shape_, false);
    this.client_.setWhiteboardShape("rectangle", c, w);
};

App.prototype.selectCircle = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "circle";
    this.selectUnselectBtn(this.shape_, false);
    this.client_.setWhiteboardShape("circle", c, w);
};

App.prototype.drawText = function(event) {
    var self = this;
    var w = g("mainFormWidth").value;
    var c = g("mainFormColorBtn").value;
    var x = 0;
    var y = 0;

    var font = (g("mainFormCanvas2").width * 0.02) + 4*parseInt(w, 10);
    var blurHandler = function(e) {
        var text = g("mainFormCanvasTextInput").value;
        var height = g("mainFormCanvasTextInput").clientHeight;
        g("mainFormCanvasTextInput").style.display = "none";
        g("mainFormCanvasTextInput").value = "";
        g("mainFormCanvasTextInput").removeEventListener("blur", blurHandler);
        if (text.length > 0) {
            self.client_.drawText(text, x, y + height, c, w);
        }
    };

    var clickHandler = function(e) {
        g("mainFormCanvas2").removeEventListener("click", clickHandler);
        x = e.hasOwnProperty("layerX") ? e.layerX : e.offsetX;
        y = e.hasOwnProperty("layerY") ? e.layerY : e.offsetY;

        g("mainFormCanvasTextInput").addEventListener("blur", blurHandler);
        g("mainFormCanvasTextInput").style.top = y + "px";
        g("mainFormCanvasTextInput").style.left = x + "px";
        g("mainFormCanvasTextInput").style.fontSize = font + "px";
        g("mainFormCanvasTextInput").style.color = c;
        g("mainFormCanvasTextInput").style.display = "block";
        g("mainFormCanvasTextInput").focus();
        
    };

    g("mainFormCanvas2").addEventListener("click", clickHandler);
};

App.prototype.selectEraser = function(event) {
    var c = g("mainFormColorBtn").value;
    var w = g("mainFormWidth").value;
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "eraser";
    this.selectUnselectBtn(this.shape_, false);
    this.client_.setWhiteboardShape("eraser", c, w);
};

App.prototype.saveSnapshot = function(e) {
    var a = g("mainFormcaptureBtn");
    var video = g("mainFormShareVideo1");
    var can = g("mainFormCanvas");
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");

    c.height = video.videoHeight;
    c.width = video.videoWidth;


    ctx.drawImage(video, 0, 0);
    ctx.drawImage(g("mainFormCanvas"), 0, 0, c.width, c.height);

    var d = c.toDataURL("image/jpeg", 1.0);
    a.download = "Snapshot_" + new Date().toLocaleString().replace(/,? /g, "_") + ".jpeg";
    a.href = d;
};


App.prototype.drawImage = function(e) {
    var file = g("mainFormImageFile").files[0];
    this.client_.drawImage(file);
};

App.prototype.whiteboard = function(event) {
   var w = g("mainFormDrawButtonGroup");
    if (w.style.display === "none") {
        w.style.display = "block";
    } else {
        w.style.display = "none";
    } 
};

App.prototype.toggleCaption = function(event) {
    if (this.captions_) {
        this.captions_ = false;
        this.client_.stopCaptions();
    } else {
        this.captions_ = true;
        this.client_.startCaptions();
    }
};

App.prototype.redrawLayout = function(event) {
    this.videoLayout(this.talkerList_, this.names_);
    this.showHideSelfView();
};

App.prototype.toggleLayout = function() {
    this.grid_ = !this.grid_;
    this.redrawLayout();
};

App.prototype.showHideFullScreenElements = function(show) {
    if (show) {
    if (g("callModal").dataset.callOrConference === "call") {
        setDisplay("mainFormcontactsAndConferences", "block");
    } else {
        g("mainFormParticipants").style.display = "block";
    }
        // g("mainFormChat").style.display = "block";
        // g("mainFormVideos").style.float = "left";
        // g("mainFormVideos").style.width = "80%";

    } else {
        setDisplay("mainFormcontactsAndConferences", "none");
        g("mainFormParticipants").style.display = "none";
        g("mainFormChat").style.display = "none";
        // g("mainFormVideos").style.float = "none";
        // g("mainFormVideos").style.width = "100%";
    }
};

App.prototype.requestFullScreen = function(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
    this.showHideFullScreenElements(false);

};

App.prototype.exitFullScreen = function() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    this.showHideFullScreenElements(true);
};

App.prototype.fullScreenChange = function() {
    var btn = g("mainFormFullScreenBtn");
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        btn.className = btn.className.replace("fullscreen", "normalscreen");
        this.showHideFullScreenElements(false);
    } else {
        btn.className = btn.className.replace("normalscreen", "fullscreen");
        this.showHideFullScreenElements(true);
    }
};


App.prototype.toggleFullScreen = function() {
    var btn = g("mainFormFullScreenBtn");
    if (btn.className.indexOf("fullscreen") !== -1) {
        btn.className = btn.className.replace("fullscreen", "normalscreen");
        // this.requestFullScreen(g("mainFormVideos"));
        this.requestFullScreen(document.body);
    } else {
        btn.className = btn.className.replace("normalscreen", "fullscreen");
        this.exitFullScreen();
    }
};

App.prototype.toggleVideo = function() {
    var btn = g("mainFormVideoBtn");
    var callType = g("callModal").dataset.callType;

    if (callType === "Voice") {
        if (window.confirm("Start Camera ?")) {
            btn.className = btn.className.replace("video-mute", "video-unmute");
            g("callModal").dataset.callType = "Video";
            this.client_.upgradeToVideo();
        }
        return;
    } 
    if (btn.className.indexOf("video-unmute") !== -1) {
        btn.className = btn.className.replace("video-unmute", "video-mute");
        this.client_.muteVideo();
        g("mainFormSelfVideoMuteImg").style.display = "block";
    } else {
        btn.className = btn.className.replace("video-mute", "video-unmute");
        this.client_.unmuteVideo();
        g("mainFormSelfVideoMuteImg").style.display = "none";
    }
};

App.prototype.toggleMic = function() {
    var btn = g("mainFormMicrophoneBtn");
    if (btn.className.indexOf("mic-unmute") !== -1) {
        btn.className = btn.className.replace("mic-unmute", "mic-mute");
        this.client_.muteMicrophone();
    } else {
        btn.className = btn.className.replace("mic-mute", "mic-unmute");
        this.client_.unmuteMicrophone();
    }
};

App.prototype.toggleSpeaker = function() {
    var btn = g("mainFormSpeakerBtn");
    if (btn.className.indexOf("speaker-unmute") !== -1) {
        btn.className = btn.className.replace("speaker-unmute", "speaker-mute");
        this.client_.muteSpeaker();
        g("mainFormRemoteVideo1").volume = 0;
    } else {
        btn.className = btn.className.replace("speaker-mute", "speaker-unmute");
        this.client_.unmuteSpeaker();
        g("mainFormRemoteVideo1").volume = 1;
    }
};


App.prototype.showShareVideo = function(shareName) {
    this.shareName_ = shareName;
    this.videoLayout(this.talkerList_, this.names_);
};

App.prototype.hideShareVideo = function() {
    this.shareName_ = "";
    this.videoLayout(this.talkerList_, this.names_);
    g("mainFormDrawButtonGroup").style.display = "none";
    g("mainFormColorBtn").value = "#ff0000";
    this.selectUnselectBtn(this.shape_, true);
    this.shape_ = "pencil";
    this.selectUnselectBtn(this.shape_, false);
};

App.prototype.videoLayout = function(talkerList, names) {
    this.talkerList_ = talkerList;
    this.names_ = names;

    if (this.talkerList_.length <= 0) {
        return;
    }

    var talkerCount = talkerList.length;

    var cnt = 0; // Calculate the number of video participants only for layouting purposes
    for (var v = 0; v < talkerCount; v++) {
        if (this.talkerList_[v] > 0) {
            cnt += 1;
        }
    }
    if (this.shareName_.length > 0) {
        cnt += 1;
    }

    var audioOnly = false;
    if (cnt === 0) { // All audio participants, display 1 window with the headphone
        cnt = 1;
        audioOnly = true;
    }

    // var positions = getPositions(6);
    var positions = getPositions(cnt, this.grid_, g("mainFormVideosContainer"));

    var shareVideo = g("mainFormShareVideo");
    // var canvas = g("mainFormCanvas");

    if (this.shareName_.length > 0) {
        g("mainFormShareName").innerHTML = this.shareName_;

        shareVideo.style.display = "block";
        setVideoPosition(shareVideo, positions[0]);

        positions[0].top = 0;
        positions[0].left = 0;

        setVideoPosition(g("mainFormCanvas"), positions[0]);
        setVideoPosition(g("mainFormCanvas2"), positions[0]);

        // canvas.style.display = "block";

        // g("mainFormCanvas").width = canvas.offsetWidth;
        // g("mainFormCanvas").height = canvas.offsetHeight;

        // canvas.width = shareVideo.offsetWidth;
        // canvas.height = shareVideo.offsetHeight;
        this.client_.resizeCanvas(shareVideo.offsetWidth, shareVideo.offsetHeight);
        
        positions = positions.slice(1);
    } else {
        setVideoPosition(shareVideo, {top: 0, left: 0, height: 0, width: 0});
        // shareVideo.style.display = "none";
    }

    var displayedVideos = [1, 0, 0, 0, 0, 0, 0];

    var i;
    var posIndex = 0;
    for (i = 0; i < talkerCount && i < this.maxDisplays_; i++) {
        var videoIndex = this.talkerList_[i];
        if (videoIndex === 0) { // if audio participant
            if(audioOnly) {
                videoIndex = 1; // audioOnly call, display 1 headphone
                g("mainFormRemoteVideo1").load();
            } else {
                continue; // skip audio only participants for updating video layout
            }
        }

        if (positions[posIndex]) {
            var elem = g("mainFormVideo"+videoIndex);
            elem.style.display = "block";
            setVideoPosition(elem, positions[posIndex++]);

            displayedVideos[videoIndex] = 1;

            g("mainFormRemotePart" + videoIndex).innerHTML = names[i];
        }
    }

    for (i = 1; i <= this.maxDisplays_; i++) {
        if (displayedVideos[i] === 0) {
            var elem = g("mainFormVideo"+i);
            setVideoPosition(elem, {top: 0, left: 0, height: 0, width: 0});
            elem.style.display = "none";
            g("mainFormRemotePart" + i).innerHTML = "";
        }
    }

    var changed = false;
    if (this.positions_.length !== positions.length) {
        changed = true;
    } else {
        for (var m = 0; m < positions.length; m++) {
            if (positions[m].width != this.positions_[m].width || 
                positions[m].height != this.positions_[m].height) {
                changed = true;
                break;
            } 
        }
    }

    if (changed) {
        this.positions_ = positions;
        this.maxDisplays();
    }
};

App.prototype.setActiveTalker = function() {
    var n = g("mainFormParticipantsList").getElementsByClassName("list-name");
    for (var i = 0; i < n.length; i++) {
        if (n[i].dataset.id === this.activeTalkerId_) { // active talker
            if(n[i].className.indexOf(" nospeaker") !== -1) { // Set active talker only if their hand is not raised or not allowed
                n[i].className = "list-name speaker"; 
            }
        } else if (n[i].className.indexOf(" speaker") !== -1) { // disable active talker only if he is a talker and name does not match
           n[i].className = n[i].className.replace(" speaker", " nospeaker"); 
        }
    }
    this.arrangeParticipants();
};

App.prototype.setRaiseHand = function(name) {
    var n = g("mainFormParticipantsList").getElementsByClassName("list-name");
    for (var i = 0; i < n.length; i++) {
        if (n[i].innerHTML === name) {
           n[i].className = "list-name handraised"; 
        } 
    }
    this.arrangeParticipants();
};

App.prototype.arrangeParticipants = function() {
    var participants = g("mainFormParticipantsList").children;
    for ( var p = 0; p < participants.length; p++) {
        if (p !== 0 && participants[p].firstChild.className.indexOf(" speaker") !== -1) {
            g("mainFormParticipantsList").insertBefore(participants[p], participants[0]);
        }

        if (p > 1 && participants[p].firstChild.className.indexOf(" handraised") !== -1) {
            g("mainFormParticipantsList").insertBefore(participants[p], participants[1]);
        }
    }
};


App.prototype.startShare = function(e) {
    var self = this;

    var stopShare = function() {
        g("mainFormShareBtn").style.opacity = 0.5;
        self.client_.stopShare(function(msg) {
            self.hideShareVideo();
            g("mainFormShareVideo1").src = "";
            self.presenting_ = false;
        });
    };

    if (self.presenting_ === false) {
        if (self.shareName_.length > 0) {
            self.showModal("A share is going on. Please wait for it to be stopped before sharing", true, true, "OK");
            return;
        }
        self.client_.isShareEnabled(function(b) {
            if (!b) {
                var x = "To start sharing - ";
                x += "<a href='https://chrome.google.com/webstore/detail/socialvid-webrtc-share/bjhmiolgijcdfhdjlgpdaofbbdlpefmc' target='_blank'>Install Extension</a>";
                self.showModal(x, true, true, "OK");
                return;
            }
            self.client_.startShare(function(msg) {
                switch(msg.type) {
                    case "localShareStream":
                        g("mainFormShareBtn").style.opacity = 1.0;
                        attachMediaStream(g("mainFormShareVideo1"), msg.stream);
                        self.showShareVideo("Me");
                        self.presenting_ = true;
                    break;

                    case "localShareStreamEnded":
                        stopShare(); 
                    break;
        
                    case "shareOffer":
                    break;

                    case "shareGetUserMediaFailed":
                        self.showModal("Start share failed - " + msg.error.name, true, true, "OK");
                    break;
                }
            });
        });
    } else {
        stopShare();
    }
};

App.prototype.openChat = function(e) {
    setDisplay("mainFormcontactsAndConferences", "none");
    g("mainFormParticipants").style.display = "none";
    g("mainFormChat").style.display = "block";
    g("mainFormChatText").focus();
};

App.prototype.closeChat = function() {
    g("mainFormChat").style.display = "none";
    if (g("callModal").dataset.callOrConference === "call") {
        setDisplay("mainFormcontactsAndConferences", "block");
    } else {
        g("mainFormParticipants").style.display = "block";
    }
};

App.prototype.clearChat = function() {
    g("mainFormChatsList").innerHTML = "";
};

App.prototype.addChat = function(txt, username) {
    var me = false;
    var align = "left";
    var timeAlign = "right";
    if (username === undefined) {
        me = true;
        username = "You";
        align = "right";
        timeAlign = "left";
    }

    var time = new Date();
    var strTime = time.getHours() + ":" + (time.getMinutes() <=9 ? "0"+time.getMinutes() : time.getMinutes());

    var li = document.createElement("li");
    li.innerHTML = "<p style=\"text-align: " + align + ";\"><b>" + username + "</b></p><p style=\"text-align: " + align + ";\">" + txt + "</p><p style=\"text-align: " + timeAlign + "; font-size: 85%;\">" + strTime + "</p>";
    
    g("mainFormChatsList").appendChild(li);
    g("mainFormChatsList").scrollTop = g("mainFormChatsList").scrollHeight;
};

App.prototype.sendChat = function() {
    var txt = g("mainFormChatText").value;
    this.addChat(txt);
    this.client_.sendChat(txt);
    g("mainFormChatText").value = ""; 
};


App.prototype.transferFile = function(e) {
    g("fileTransferModalHeader").innerHTML = ("Transfer File(s)");
    g("fileTransferModalProgress").style.display = "none";

    g("fileTransferModalFileInput").style.display = "inline-block"; 
    g("fileTransferModalFileDrop").style.display = "inline-block";

    g("fileTransferModalUpload").style.display = "inline-block";
    g("fileTransferModalCancel").innerHTML = ("Cancel");

    g("fileTransferModalFileInput").value = "";
    g("fileTransferModalProgress").getElementsByTagName("progress")[0].value = 0;
    g("fileTransferModalProgress").style.display = "none";

    g("fileTranferModalIncomingFiles").style.display = "none";

    showModal("fileTransferModal");
};

App.prototype.hideFileTransfer = function() {
    hideModal("fileTransferModal");
};

App.prototype.fileDragHover = function(e) {
    e.stopPropagation();
    e.preventDefault();
    // e.target.className = (e.type == "dragover" ? "hover" : "");
};

App.prototype.fileSelectHandler = function(e) {
    this.fileDragHover(e);
    var files = e.target.files || e.dataTransfer.files;
    this.sendFilesToServer(files);

};

App.prototype.uploadFiles = function() {
    this.sendFilesToServer(g("fileTransferModalFileInput").files);
};

App.prototype.sendFilesToServer = function(files) {
    g("fileTransferModalProgress").style.display = "block";

    g("fileTransferModalFileInput").style.display = "none";
    g("fileTransferModalFileDrop").style.display = "none";


    g("fileTransferModalProgress").style.display = "block";
    var prog = g("fileTransferModalProgress").getElementsByTagName("progress")[0];

    this.client_.uploadFiles(files, function(evt) {
        switch(evt.type) {
            case "progress":
                prog.value = evt.percent;
                alog(" PROGRESS: " + evt.percent);
                break;

            case "status":
                g("fileTransferModalUpload").style.display = "none";
                g("fileTransferModalCancel").innerHTML = ("OK");
                break;
        }
    });
};

App.prototype.downloadFile = function(files) {
    g("fileTransferModalHeader").innerHTML = ("Download File(s)");
    g("fileTransferModalProgress").style.display = "none";

    g("fileTransferModalFileInput").style.display = "none";
    g("fileTransferModalFileDrop").style.display = "none";

    g("fileTransferModalUpload").style.display = "none";
    g("fileTransferModalCancel").innerHTML = ("OK");

    g("fileTransferModalFileInput").value = "";
    g("fileTransferModalProgress").getElementsByTagName("progress")[0].value = 0;

    var self = this;

    for (var k = 0; k < files.length; k++) {
        var fname = files[k];
        var a = document.createElement("a");
        a.href = "#";
        a.innerHTML = fname;
        a.addEventListener("click", function() {
            self.client_.downloadFile(fname);
        });
        g("fileTranferModalIncomingFiles").appendChild(a);
        g("fileTranferModalIncomingFiles").appendChild(document.createElement("br"));
    }

    g("fileTranferModalIncomingFiles").style.display = "block"; 
    showModal("fileTransferModal");
};

App.prototype.selfView = function(e) {
    var sv = g("mainFormSelfView");
    if (this.selfView_) {
        // sv.style.display = "none";
        this.selfView_ = false;
        this.showHideSelfView();
    } else {
        // sv.style.display = "block";
        this.selfView_ = true;
        this.showHideSelfView();
    }
};

App.prototype.popOut = function(e) {

    for (var i = 0; i < this.talkerList_.length; i++) {
        var height = screen.height / 3;
        var width = screen.width / 3;
        var settings = "height=" + height + ", width=" + width + ", ";
        settings += "scrollbars=no, location=no, directories=no, status=no, menubar=no, toolbar=no, resizable=no, dependent=no, alwaysRaised=yes";
        alog("Using " + width + "x" + height + " " + settings);
        this.wnd_[i] = window.open("/video.html?video=" + (i+1),  this.names_[i], settings);
    }

};


App.prototype.hangup = function(e) {
    var self = this;
    self.showModal("Disconnecting call...", false, false, "");

    var hangupNumber = function(callId) {
        var req = new XMLHttpRequest();
        var url = "/adminapi/v1/custom/hangup";
        var params = {
            id: q.conferenceId,
            callid: callId
        };

        req.open("POST", url, true);
        req.onload = function() {
            alog("hangup response = " + req.status + " " + req.statusText + " " + req.responseText);
        };
        req.send(JSON.stringify(params));
        alog("Hangup - callid=" + self.callId);
    };

    var dialout = (q.hasOwnProperty("dialout") && (q.dialout === "true" || q.dialout === "1")); 
    if (dialout) {
        var req = new XMLHttpRequest();
        var url = "/adminapi/v1/custom/getconferees";
        var number = g("inputNumber").value;
        var params = {
            id: q.conferenceId
        }; 

        req.open("POST", url, true);
        req.onload = function() {
            var parser = new DOMParser();
            var xml = parser.parseFromString(req.responseText, "text/xml");
            var participants = xml.getElementsByTagName("conferee");
            for (var i = 0; i < participants.length; i++) {
                var n = participants[i].getElementsByTagName("ddiOut")[0].childNodes[0].nodeValue;
                if (n === number) {
                    hangupNumber(participants[i].getElementsByTagName("callid")[0].childNodes[0].nodeValue);
                    return;
                }
            }
            alog("Hangup - number " + number + " not found in conferees list");
        };

        req.send(JSON.stringify(params));

    }
    self.client_.disconnectCall(function() {
        self.showModal("Call Disconnected...", true, true, "OK");
        self.reset();
    });
    e.stopPropagation();
    e.preventDefault();
};

function loadDevices (app, cb) {
    app.getDevices(function(devices) {
        if (devices.status === 0) {
            var s = g("inputMic");
            s.innerHTML = "";
            for (var i = 0; i < devices.audioInputDevices.length; i++) {
                var opt = document.createElement('option');
                opt.value = devices.audioInputDevices[i].id;
                opt.innerHTML = devices.audioInputDevices[i].label;
                s.add(opt);
            }

            s = g("inputCamera");
            s.innerHTML = "";
            for (var i = 0; i < devices.videoInputDevices.length; i++) {
                var opt = document.createElement('option');
                opt.value = devices.videoInputDevices[i].id;
                opt.innerHTML = devices.videoInputDevices[i].label;
                s.add(opt);
            }

            s = g("outputSpeaker");
            s.innerHTML = "";
            for (var i = 0; i < devices.audioOutputDevices.length; i++) {
                var opt = document.createElement('option');
                opt.value = devices.audioOutputDevices[i].id;
                opt.innerHTML = devices.audioOutputDevices[i].label;
                s.add(opt);
            }
        }
        cb();
    });
};

window.onload = function() {
    var guest = false;
    if (window.location.pathname === "/guest.html") {
        guest = true;
    }

    var app = new App(guest);
    window.webrtcApp = app;

    if (guest) {
        if (window.localStorage["guestName"]) {
            g("inputText").value = window.localStorage["guestName"];
        }
    } else {
        if (window.localStorage["email"]) {
            g("inputEmail").value = window.localStorage["email"];
            g("inputPassword").value = window.localStorage["passwd"];
        }
    }

    g("signInForm").onsubmit = function(e) {
        e.preventDefault();
        g("callModal").dataset.callType = "Video";
        app.login();
    };

    g("genericModal").style.display = "block";
    g("fileTransferModal").style.display = "block";

    g("genericModalClose").addEventListener("click", function() { app.hideGenericModal() });

    if (!guest) {
        g("callModal").style.display = "block";
        g("incomingCallModal").style.display = "block";

        g("callModalClose").addEventListener("click", function() { hideModal("callModal") } );
        g("callModalCancel").addEventListener("click", function() { hideModal("callModal") } );

        g("callModalVoiceCall").addEventListener("click", app.voiceCall.bind(app));
        g("callModalVideoCall").addEventListener("click", app.videoCall.bind(app));


        g("incomingCallModalRejectCall").addEventListener("click", app.rejectCall.bind(app));
        g("incomingCallModalAnswerCall").addEventListener("click", app.answerCall.bind(app));
        g("incomingCallModalIgnore").addEventListener("click", app.ignoreCall.bind(app));
        g("incomingCallModalClose").addEventListener("click", app.ignoreCall.bind(app));

        g("mainFormConferencesAdd").addEventListener("click", app.showAddConference.bind(app));
    } else {

        var audio = true;
        var video = true;
        var dialout = false;

        if (q.hasOwnProperty("audio")) {
            if (q.audio === "false" || q.audio === "0") 
                audio = false;
        }

        if (q.hasOwnProperty("video")) {
            if (q.video === "false" || q.video === "0") 
                video = false;
        }

        dialout = (q.hasOwnProperty("dialout") && (q.dialout === "true" || q.dialout === "1")); 

        if (audio) {
            g("inputSubmitVoice").style.display = "inline-block";
            g("micSelectDiv").style.display = "block";
        }

        if (video) {
            g("inputSubmit").style.display = "inline-block";
            g("cameraSelectDiv").style.display = "block";
        }

        if (dialout) {
            g("inputNumber").style.display = "inline-block";
            g("signInDiv").getElementsByTagName("h2")[0].innerHTML = "Please enter your name and number";
        }

        if (!audio && !video) {
            g("inputSubmitShare").style.display = "inline-block";
            g("inputSubmitShare").disabled = false;

            g("mainFormRaiseHandBtn").style.display = "none";
            g("mainFormTransferBtn").style.display = "none";
            g("mainFormDisplaysBtn").style.display = "none";
            g("mainFormRecordBtn").style.display = "none";
            g("mainFormLayoutBtn").style.display = "none";
            g("mainFormVideoBtn").style.display = "none";
            g("mainFormMicrophoneBtn").style.display = "none";
            g("mainFormSpeakerBtn").style.display = "none";
            g("mainFormSelfViewBtn").style.display = "none";
            g("mainFormPopoutBtn").style.display = "none";

            g("inputSubmitShare").addEventListener("click", function(e) {
                e.preventDefault();
                g("callModal").dataset.callType = "Share";
                if (dialout) {
                    app.dialout(g("inputNumber").value, g("inputText").value, function(status) {
                        if (status) {
                            app.login();
                        }
                    });
                } else {
                    app.login();
                }
            });
        } else {
            g("speakerSelectDiv").style.display = "block";
            loadDevices(app, function(){});
        }

        g("inputSubmitVoice").disabled = false;
        g("inputSubmitVoice").addEventListener("click", function(e) {
            e.preventDefault();
            g("callModal").dataset.callType = "Voice";
            app.login();
        });
    }


    g("mainFormRaiseHandBtn").style.display = "none";
    g("mainFormDrawButtonGroup").style.display = "none";
    g("mainFormColorBtn").addEventListener("change", app.selectColor.bind(app));
    if(navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
        g("mainFormColorBtn").style.height = "45px"; 
        g("mainFormColorBtn").style.verticalAlign = "top"; 
    }

    g("mainFormWidth").addEventListener("change", app.selectColor.bind(app));
    // g("mainFormWidthBtn").addEventListener("click", app.selectLineWidth.bind(app));
    g("mainFormpencilBtn").addEventListener("click", app.selectPencil.bind(app));
    g("mainFormlineBtn").addEventListener("click", app.selectLine.bind(app));
    g("mainFormrectangleBtn").addEventListener("click", app.selectRectangle.bind(app));
    g("mainFormcircleBtn").addEventListener("click", app.selectCircle.bind(app));
    g("mainFormtextBtn").addEventListener("click", app.drawText.bind(app));
    g("mainFormeraserBtn").addEventListener("click", app.selectEraser.bind(app));
    g("mainFormcaptureBtn").addEventListener("click", app.saveSnapshot.bind(app));
    g("mainFormImageFile").addEventListener("change", app.drawImage.bind(app));


    g("mainFormRaiseHandBtn").addEventListener("click", app.raiseHand.bind(app));
    g("mainFormTransferBtn").addEventListener("click", app.callTransfer.bind(app));
    g("mainFormDisplaysBtn").addEventListener("change", app.maxDisplays.bind(app));
    g("mainFormRecordBtn").addEventListener("click", app.record.bind(app));
    g("mainFormWhiteboardBtn").addEventListener("click", app.whiteboard.bind(app));
    // g("mainFormCaptionBtn").addEventListener("click", app.toggleCaption.bind(app));
    // g("mainFormCaptionBtn").addEventListener("click", TogetherJS(this));
    g("mainFormLayoutBtn").addEventListener("click", app.toggleLayout.bind(app));
    g("mainFormFullScreenBtn").addEventListener("click", app.toggleFullScreen.bind(app));
    g("mainFormVideoBtn").addEventListener("click", app.toggleVideo.bind(app));
    g("mainFormMicrophoneBtn").addEventListener("click", app.toggleMic.bind(app));
    g("mainFormSpeakerBtn").addEventListener("click", app.toggleSpeaker.bind(app));
    g("mainFormShareBtn").addEventListener("click", app.startShare.bind(app));
    g("mainFormChatBtn").addEventListener("click", app.openChat.bind(app));
    g("mainFormFileTransferBtn").addEventListener("click", app.transferFile.bind(app));
    g("mainFormSelfViewBtn").addEventListener("click", app.selfView.bind(app));
    g("mainFormPopoutBtn").addEventListener("click", app.popOut.bind(app));
    g("mainFormHangupBtn").addEventListener("click", app.hangup.bind(app));


    g("fileTransferModalBody").addEventListener("dragover", app.fileDragHover.bind(app));
    g("fileTransferModalBody").addEventListener("dragleave", app.fileDragHover.bind(app));
    g("fileTransferModalBody").addEventListener("drop", app.fileSelectHandler.bind(app));
    g("fileTransferModalUpload").addEventListener("click", app.uploadFiles.bind(app));
    g("fileTransferModalClose").addEventListener("click", app.hideFileTransfer.bind(app));
    g("fileTransferModalCancel").addEventListener("click", app.hideFileTransfer.bind(app));

    // g("mainFormRemoteVideo1").addEventListener("loadedmetadata", app.setupForVideo.bind(app));


    g("mainFormChatText").addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            // g("mainFormChatForm").submit();
            g("mainFormChatSubmit").click();
        }
    });
    g("mainFormChatCloseBtn").addEventListener("click", app.closeChat.bind(app));

    g("mainFormChatForm").addEventListener("submit", function(e) {
                app.sendChat();
                e.preventDefault();
            });

    document.addEventListener("fullscreenchange", app.fullScreenChange.bind(app));
    document.addEventListener("webkitfullscreenchange", app.fullScreenChange.bind(app));
    document.addEventListener("mozfullscreenchange", app.fullScreenChange.bind(app));
    document.addEventListener("MSFullscreenChange", app.fullScreenChange.bind(app));

    window.addEventListener("resize", app.redrawLayout.bind(app));

    window.addEventListener("keydown", function(e) {
        if (e.keyCode === 27) {
            app.hideGenericModal();
        }
    });

    var elem = document.getElementsByClassName("call-button-group")[0];

    var timer = setTimeout(function(){}, 100);

    g("mainFormVideosContainer").addEventListener("mousemove", function(e) {

        clearTimeout(timer); 
        elem.style.bottom = "5px";
        timer = setTimeout(function() {
            elem.style.bottom = "-150px"; 
        }, 3000);
    });

    if (app.client_.isWebRtcSupported()) {
        g("inputSubmit").disabled = false;
    } else {
        app.showModal("Unsupported Browser - Please use Chrome", true, true, "OK");
    }
};

})();
