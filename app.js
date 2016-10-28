'use strict';

// set up ========================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');

var db = require('./db');
var accountRoute = require('./routes/account');

var app = express();

// configuration =================

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Routes //

app.use('/', accountRoute);
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = app;