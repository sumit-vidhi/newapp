var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// allowCrossDomain = function(req, res, next) { 
//         res.header('Access-Control-Allow-Origin', '*'); 
//          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
//           res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); 
//            if ('OPTIONS' === req.method) {    res.send(200);  } else {   
//                 next(); 
//  }};
// app.use(allowCrossDomain);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connection = require('express-myconnection');
var request = require('request');
var flash    = require('connect-flash');
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


app.use(session({ secret: '121212121212', cookie: { maxAge: 60 * 60 * 1000 }, resave: true, saveUninitialized: true }))
global.SITE_NAME = 'Freash By Transform' 
app.use(cookieParser());
app.use(flash());






global.SITE_NAME = 'FreashByTransfor! App' 
global.SITE_URL = 'http://localhost:4300/'
require('./config/routes.js')(app);
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
