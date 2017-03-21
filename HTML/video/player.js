(function(m){
var app;
// var app2;
var g = function(i) {
    var e = document.getElementById(i);
    if (!e) console.error("INVALID ELEMENT " + i);
    return e;
};
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

var getFormattedTime = function(t) {
    var sec = Math.floor(t);

    var minute = Math.floor(t/60);
    if (minute < 10) {
        minute = "0" + minute;
    }

    var seconds = sec%60;
    if (seconds < 10) {
        seconds = "0" + seconds; 
    }

    return "" + minute + ":" + seconds;
};


var showState = function(state) {
     console.log("ShowState - State: " + state);
     g("videoLoading").style.display = "none";
     g("videoPlay").style.display = "none"; 
     g("videoPause").style.display = "none"; 
     g("videoReload").style.display = "none"; 
     g("videoRewind").style.display = "none";
     g("videoForward").style.display = "none";

     switch(state) {
         case "LOADING":
             g("videoLoading").style.display = "block";
         break;

         case "READY_TO_PLAY":
         case "PAUSED":
             g("videoPlay").style.display = "block"; 
         break;

         case "PLAYING":
             g("videoPause").style.display = "block"; 
             g("videoRewind").style.display = "block";
             g("videoForward").style.display = "block";
         break;

        case "ENDED":
            g("videoReload").style.display = "block"; 
        break;
     }
};


var playClicked = function(e) {
    app.play();
    // app2.play();
};

var pauseClicked = function(e) {
    app.pause();
    // app2.pause();
};

var getPrintRate = function() {
    var x = "" + app.getRate();
    if (x.indexOf(".5") === -1) {
        x += ".0";
    }
    return x;
};

var rewindClicked = function(e) {
    app.setRate(app.getRate() - 0.5);
    g("speed").innerHTML = "[" + getPrintRate() + "X]";
};

var forwardClicked = function(e) {
    app.setRate(app.getRate() + 0.5);
    g("speed").innerHTML = "[" + getPrintRate() + "X]";
};

var callback = function(evt) {
    switch(evt.type) {
        case "status":
            if (evt.status !== 0) {
                alert("Invalid Recording - " + evt.err);
            } else {
                console.log("Loaded Recording");
            }
        break;

        case "state":
            showState(evt.state);
        break;

        case "buffered":
           var percent = evt.buffered; 
           g("mainFormProgress2").value = percent;
        break;

        case "progress":
            var current = evt.progress;
            var total = evt.total;
            var prog = g("mainFormProgress");
            prog.value = Math.floor((current * 100)/total);
            g("totalTime").innerHTML = getFormattedTime(total);
            g("currentTime").innerHTML = getFormattedTime(current);
            var offset = -35 + Math.floor((prog.offsetWidth * current)/total);
            g("seeker").style.left = offset+"px";
        break;

    }
};


window.onload = function() {
    var jsonfile = getQueryVariables()["video"];

    app = new WebRtcPlayer("https://nstl.socialvid.in/videos/981921861291/c229f7bb44080de7/master.json", g("webrtcPlayerContainer"), callback);
    // app2 = new WebRtcPlayer(jsonfile, g("webrtcPlayerContainer2"), callback);
    window.webrtcApp = app;

    g("videoPlay").addEventListener("click", playClicked);

    g("videoPause").addEventListener("click", pauseClicked);

    g("videoRewind").addEventListener("click", rewindClicked);

    g("videoForward").addEventListener("click", forwardClicked);

    g("videoReload").addEventListener("click", function() {
        window.location.reload(false);
    });

    window.addEventListener("resize", app.redraw.bind(app));
};

})(window);
