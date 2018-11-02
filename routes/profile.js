const router = require('express').Router();
const Widget = require('../models/instance-models')
var bodyParser = require('body-parser')
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');

const defaultChannel = 'SQUEEZIE';

types = [
    {
        name: "weather",
        label: "Weather (name city)",
        url: '/service/weather/widget',
        frequency: 60 * 60,
        default_value: "Lille"
    },
    {
        name: "video_comments",
        label: "Video comments (video id)",
        url: '/service/google/youtube/widget-comments',
        frequency: 60,
        default_value: "TH-NgOeDbGs" // e penser
    },
    {
        name: "latest_video",
        label: "Latest video (channel id)",
        url: '/service/google/youtube/widget-latest-video',
        frequency: 60 * 60,
        default_value: "UCcziTK2NKeWtWQ6kB5tmQ8Q" // e penser
    },
    {
        name: "channel_subscriber",
        label: "Youtube subscribers channel (channel name)",
        url: '/service/google/youtube/widget-subscribers',
        frequency: 60,
        default_value: "MrAntoineDaniel"
    },
    {
        name: "video_views",
        label: "Video view (id video)",
        url: '/service/google/youtube/widget-views',
        frequency: 60,
        default_value: "TH-NgOeDbGs"
    },
    {
        name: "twitch_subscribers",
        label: "Twitch subscribers (channel name)",
        url: '/service/widget-twitch-subscribers',
        frequency: 60 * 60,
        default_value: "netratv"
    },
]

const authCheck = (req, res, next) => {
    if (!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

/*
router.get('/', authCheck, (req, res) => {
    res.render('profile', {user: req.user});
});
*/
function get_widget_type(name) {
    for (var i = 0, l = types.length; i < l; i++) {
        if (types[i].name == name)
            return (types[i]);
    }
}

router.get('/', (req, res) => {
    //res.render('profile', {user: req.user});
    if (req.query.delete != undefined) {
        var query = Widget.findById(req.query.delete);
        //var query = Widget.where({_id: req.query.delete});
        query.exec(function (err, widget) {
            if (err) {
                throw err;
            }
            widget.remove(function (){
                res.redirect('/profile')
            })
        });
        return ;
    }
    if (req.query.type != undefined){
        new Widget({
            username: req.user.id ,
            widgetname: get_widget_type(req.query.type).name,
            content: get_widget_type(req.query.type).default_value
        }).save().then((newWidget) => {
            res.redirect('/profile')
        });
        return ;
    } else {

    }
    var query = Widget.where({username: '5bc8aab0951bd3480890471f'});

    query.exec(function (err, allwidget) {
        if (err) {
            throw err;
        }
        // On va parcourir le résultat et les afficher joliment
        var awidget;
        for (var i = 0, l = allwidget.length; i < l; i++) {
            awidget = allwidget[i];
        }
    });

    /**/

    //var query = Widget.find(null);
    if (!req.user){
        res.redirect('/auth/login');
    }
    Widget.find().where('username').equals(req.user.id).exec(function (err, allwidget) {
        if (err) {
            throw err;
        }
        // On va parcourir le résultat et les afficher joliment
        var awidget;
        widgets = []
        for (var i = 0, l = allwidget.length; i < l; i++) {
            awidget = allwidget[i];
            type = get_widget_type(awidget.widgetname);
            if (type != undefined) {
                widgets.push({
                    label: type.label,
                    url: type.url,
                    content: awidget.content,
                    id: i,
                    id_bdd: awidget._id,
                    search: awidget.content,
                    type_widget: awidget.widgetname,
                    frequency: type.frequency
                });
            }
        }
        res.render('../views/services/dashboard', {data: widgets, user: req.user});
    });
});


router.get('/Meteo', (req, res) => {
    new Widget({
            username: req.user.id ,
            widgetname: "Meteo",
            content: "Lille"
        }).save().then((newWidget) => {
    });
});

router.get('/Youtube', (req, res) => {
    new Widget({
        username: req.user.id ,
        widgetname: "Youtube",
        content: "Gotaga"
    }).save().then((newWidget) => {
    });
});

module.exports = router;