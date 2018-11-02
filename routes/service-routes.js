const router = require('express').Router();
const passport = require('passport');
const key = require("../config/keys");
const {google} = require('googleapis');
const Widget = require('../models/instance-models');
var WWO = require('worldweatheronline-api');

/*
key.twitch.token
key.weather.token
key.youtube.token
*/
function update_widget(id_bdd, content) {
    var query = Widget.findById(id_bdd);

    query.exec(function (err, allwidget) {
        if (err) {
            throw err;
        }
        allwidget.content = content;
        allwidget.save();

    });
}


var client = WWO.createClient({
    key: key.weather.token,
    responseType: 'json',
    subscription: 'premium',
    locale: 'EN'
});


/* Twitch */

var request = require('request');

function getTwitchChannel(callback, req, res) {
    channel = req.query.search;
    update_widget(req.query.id_bdd, channel);
    var options = {
        url: 'https://api.twitch.tv/kraken/channels/' + channel,
        headers: {
            'Client-ID': key.twitch.token
        }
    };
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var info = JSON.parse(body);
            //console.log(info);
            res.render('../views/services/twitch/widget-twitch-subscribers', {data: info});
        }
    });

}

router.get('/twitch-subscribers', (req, res) => {
    res.render('../views/services/twitch/service-twitch-subscribers');
});

router.get('/widget-twitch-subscribers', (req, res) => {
    res_g = res;
    getTwitchChannel(null, req, res);
});

/* Twitch */

/* Start Service youtube widget subscribers */

function render_youtube(data, req, res){
    res.render('../views/services/google/youtube/widget-subscribers', {data: data});
}

function getChannel(callback, req, res) {
    var service = google.youtube('v3');
    channel = req.query.search;
    update_widget(req.query.id_bdd, channel);
    service.channels.list({
        key: key.youtube.token,
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found.');
        } else {
            callback(channels[0], req, res)
        }
    });
}

router.get('/google/youtube-subscribers', (req, res) => {
    res.render('../views/services/google/youtube/service-subscribers');
});

router.get('/google/youtube/widget-subscribers', (req, res) => {
    getChannel(render_youtube, req, res);
});


/* End Service youtube widget subscribers */

/* Start Service youtube widget views */

function render_views(data, req, res){
    res.render('../views/services/google/youtube/widget-views', {data: data});
}
// TH-NgOeDbGs => last e-penser
function getVideo(callback, req, res) {
    var service = google.youtube('v3');
    video = req.query.search;
    update_widget(req.query.id_bdd, video);
    service.videos.list({
        key: key.youtube.token,
        part: 'snippet,contentDetails,statistics,status',
        id: video,
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error:widget ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found.');
        } else {
            callback(channels[0], req, res)
        }
    });
}

router.get('/google/youtube-views', (req, res) => {
    res.render('../views/services/google/youtube/service-views');
});

router.get('/google/youtube/widget-views', (req, res) => {
    getVideo(render_views, req, res);
});


/* End Service youtube widget views */

/* Start Service youtube widget comments */

function render_comments(data, req, res){
    res.render('../views/services/google/youtube/widget-comments', {data: data});
}
// TH-NgOeDbGs => last e-penser
function getComments(callback, req, res) {
    var service = google.youtube('v3');
    video = req.query.search;
    update_widget(req.query.id_bdd, video);
    service.commentThreads.list({
        key: key.youtube.token,
        part: 'snippet',
        textFormat: "plainText",
        videoId: video,
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error:widget ' + err);
            return;
        }
        var comments = response.data.items;
        if (comments.length == 0) {
            console.log('No channel found.');
        } else {
            callback(comments, req, res)
        }
    });
}

router.get('/google/youtube-comments', (req, res) => {
    res.render('../views/services/google/youtube/service-comments');
});

router.get('/google/youtube/widget-comments', (req, res) => {
    getComments(render_comments, req, res);
});


/* End Service youtube widget comments */

/* Start Service youtube widget latest_video*/

function render_latest_video(data, req, res){
    res.render('../views/services/google/youtube/widget-latest-video', {data: data});
}

// TH-NgOeDbGs => last e-penser
function getLatestVideo(callback, req, res) {
    var service = google.youtube('v3');

    channel = req.query.search;
    update_widget(req.query.id_bdd, channel);
    service.search.list({
        key: key.youtube.token,
        part: 'snippet',
        channelId: channel,
        maxResults : "10",
        order: "date",
        type: "video"
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error:widget ' + err);
            return;
        }
        var videos = response.data.items;
        if (videos.length == 0) {
            console.log('No channel found.');
        } else {
            callback(videos, req, res)
        }
    });
}

router.get('/google/youtube-latest-video', (req, res) => {
    res.render('../views/services/google/youtube/service-latest-video');
});

router.get('/google/youtube/widget-latest-video', (req, res) => {
    getLatestVideo(render_latest_video, req, res);
});


/* End Service youtube widget latest */

/* Start Service weather widget temp */

router.get('/weather', (req, res) => {
    res.render('../views/services/weather/service');
});

router.get('/weather/widget', (req, res) => {
    coordinates = req.query.search;

    update_widget(req.query.id_bdd, coordinates);

    client.localWeatherApi({
        q: coordinates,
        num_of_days: "3",
        name_city: coordinates
    }, function(err, result) {
        if (!err) {
            var data = JSON.parse(result);
            client.timeZoneApi({
                q: data.data.request[0].query
            }, function(err, result) {
                if (!err) {
                    var result = JSON.parse(result);
                    var parse = result.data.time_zone[0].localtime;
                    var firstcut = parse.indexOf(' ');
                    var lastcut = parse.indexOf(':');
                    var current_hour = parse.substring(firstcut, lastcut);
                    res.render('../views/services/weather/widget-map', {data: data.data.weather, current_hour: current_hour, current_time: parse});
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});

/* End Service weather widget temp */

module.exports = router;
