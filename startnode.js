/**
 * Created by pkonwar on 1/22/2017.
 */

var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync('certs/mydomain.key', 'utf8');
var certificate = fs.readFileSync('certs/certificate.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express');       //load express dependency
var app = express();        //new instance of express

var request = require('request');   //make http request

app.use(express.static("./HTML"));        //root of the application. serves static files

var httpsServer = https.createServer(credentials, app);

app.post('/listening', function (req, res) {
    console.log("Recieved something")
    console.log(res);
    res.send({name : "partha"});
});

//app.listen(3000);           //listen on 3000 port
httpsServer.listen(8443);



var session = null;

var data = {email: "arunsimon@gmail.com", password: "Arun123"};

var recieveConferenceUrls = function recieveConferenceUrls(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("comference urls: " + JSON.stringify(body))
        //session = body.session;
    }
}


var recieveConferenceData = function revieveConferenceData(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("comference id : " + body.id)
        //session = body.session;

        var conferenceLinkData = {
            "email": "arunsimon@gmail.com",
            "session": session,
            "id": body.id
        }

        request.post('https://ha.socialvid.in/adminapi/v1/user/conference/get', {json: conferenceLinkData}, recieveConferenceUrls);
    }
}

//callback of the recieve data
var recieveData = function recieveData(error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body)
        session = body.session;
        console.log("Session Id in the callback : " + session);

        var conferenceData = {
            "email": "arunsimon@gmail.com",
            "session": body.session,
            "name": "Test2",
            "mode": "presenter",
            "autoRecord": true,
            "maxBitrateKbps": "512",
            "maxParticipants": "20"
        }

        request.post('https://ha.socialvid.in/adminapi/v1/user/conference/add', {json: conferenceData}, recieveConferenceData);
    }
};

//make a https login request
//request.post('https://ha.socialvid.in/adminapi/v1/userlogin',{json: data}, recieveData);

console.log('application started in port 3000');
module.exports = app;       // export this module to use this as a dependency in other module