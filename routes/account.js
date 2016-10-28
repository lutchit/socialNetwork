'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');

var users = require ("../config").users;

router.post('/account/signup', function(req, res) {
	if(!req.body.email || !req.body.firstname || !req.body.surname) {
		res.status(401).send("Required email/firstname/surname");
	} else {
        var bio = _.isUndefined(req.body.biography) ? '' : req.body.biography;
		users.signup(req.body.email, req.body.firstname, req.body.surname, bio, function(user, err){
			if(err) {
				console.log(err.cause);
				res.status(err.status).send(err.cause);
			} else {
                res.status(200).send('User created');
			}
		});
	}
});

module.exports = router;