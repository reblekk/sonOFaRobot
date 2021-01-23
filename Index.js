var TelegramBot = require('node-telegram-bot-api');
var token = '1572317805:AAHgI3E0vpv5NobNpZA0pkeeLPnvBNMavSQ';
var bot = new TelegramBot(token, { polling: true });
//const bot = new Composer

//rapidapi shits
var unirest = require("unirest");


// Require google from googleapis package.
var request = require('request');
const readline = require('readline');
const { google } = require('googleapis')

//Reddit things
const randomPuppy = require('random-puppy');

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth
    // Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
    '754364690188-kr7qo3nb3q5gno008dn2grkqsnpk2kro.apps.googleusercontent.com',
    'phwb5PdK1-Sszyto2LWOFvOq'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
    refresh_token: '1//04QfZTuvoHuN5CgYIARAAGAQSNwF-L9IryindX9yukx5WuuKM-AK7PlhS75gVuMkd4o3z9iAMseWzqck3rCENdKT8Kny6vHZrBFk',
})


//Youtube download stuffs
const fs = require('fs')
const youtubedl = require('youtube-dl')
const { info } = require('console');


// add a day
var date = new Date();
date.setDate(date.getDate() + 1);

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

bot.onText(/\/tmr/, function(msg, match) {
    var movie = match[1];
    var chatId = msg.chat.id;






    //Function to Show events
    calendar.events.list({
        calendarId: 'lti2s0ni6l9ndnhp0g35aeld2s@group.calendar.google.com',
        timeMin: (new Date()).toISOString(),
        timeMax: date,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming Events Till Tomorrow:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start;
                //console.log(`${start} - ${event.summary}`);
                bot.sendMessage(chatId, event.summary);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });

});

//function to find movies

bot.onText(/\/movie (.+)/, function(msg, match) {
    var movie = match[1];
    var chatId = msg.chat.id;

    request(`http://www.omdbapi.com/?apikey=6d62ac52&t=${movie}`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + movie + '.....', { parse_mode: 'Markdown' })
                .then(function(msg) {
                    var res = JSON.parse(body);
                    bot.sendPhoto(chatId, res.Poster, { caption: 'Result:\n' + res.Title + 'Release: \n' + res.Released + '\n Actors \n' + res.Actors });
                })

        }
    });

});



bot.onText(/\/reddit (.+)/, function(msg, match) {
    var subreddit = match[1];
    var chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Looking for your thing 🔎')

    randomPuppy(subreddit).then(url => {
        bot.sendMessage(chatId, url);
        if (typeof url === 'undefined') {
            bot.sendMessage(chatId, subreddit + ' ' + 'deosnt want to share their thing with us 😔 ');
        }
    })



});


bot.onText(/\/yt (.+)/, function(msg, match) {
    var viedeoLink = match[1];
    var chatId = msg.chat.id;




    const video = youtubedl(viedeoLink,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname })

    // Will be called when the download starts.
    video.on('info', function(info) {
        var name = info._filename
        console.log('Download started')
        console.log('filename: ' + info._filename)
        console.log('size: ' + info.size)
    })

    video.pipe(fs.createWriteStream('myvideo.mp4'))

});




//quotes

bot.onText(/\/quotes/, function(msg, match) {
    var quotes = match[1];
    var chatId = msg.chat.id;

    var req = unirest("GET", "https://quotes15.p.rapidapi.com/quotes/random/");

    req.headers({
        "x-rapidapi-key": "0211b597c7mshd42d749ec4d72b1p1505b7jsn04f11f31bb04",
        "x-rapidapi-host": "quotes15.p.rapidapi.com",
        "useQueryString": true
    });


    req.end(function(res) {
        if (res.error) throw new Error(res.error);

        //console.log(res.body.originator.name);
        bot.sendMessage(chatId, ' " ' + res.body.content + ' " ' + ' ' + ' by ' + res.body.originator.name);
    });





});



//OCRLY
bot.onText(/\/ocr (.+)/, function(msg, match) {
    var OCR_URL = match[1];
    var chatId = msg.chat.id;
    var req = unirest("GET", "https://ocrly-image-to-text.p.rapidapi.com/");

    req.query({
        "imageurl": OCR_URL,
        "filename": "sample.jpg"
    });

    req.headers({
        "x-rapidapi-key": "0211b597c7mshd42d749ec4d72b1p1505b7jsn04f11f31bb04",
        "x-rapidapi-host": "ocrly-image-to-text.p.rapidapi.com",
        "useQueryString": true
    });


    req.end(function(res) {
        if (res.error) throw new Error(res.error);

        //console.log(res.body.originator.name);
        console.log(res.body)
        console.log("hello");
        bot.sendMessage(chatId, res.body);
    });





});
