'use strict';

var jwt = require('jsonwebtoken');
var _ = require('lodash');

exports.ensureAuthorized = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'aabbcc', function(err, decoded) {      
            if (err) {
                res.status(401).send('You\'re not authentified');
            } else {
                req.token = token;
                next();
            }
        });
    } else {
        res.status(401).send('You\'re not authentified');
    }
};