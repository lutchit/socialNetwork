'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');

var users = require ("../config").users;

router.get('/account/:id', function(req, res) {
	users.get(req.params.id, function(user, err) {
		if(err) {
			console.log(err.cause);
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).json(user);
		}
	});
});

router.post('/account/signup', function(req, res) {
	if(!req.body.email || !req.body.firstname || !req.body.surname) {
		res.status(401).send("Required email/firstname/surname");
	} else {
		users.signup(req.body.email, req.body.firstname, req.body.surname, req.body.biography, function(user, err){
			if(err) {
				console.log(err.cause);
				res.status(err.status).send(err.cause);
			} else {
                res.status(200).send('User created');
			}
		});
	}
});

router.put('/account/:id', function(req, res) {
	users.update(req.params.id, req.body.email, req.body.firstname, req.body.surname, req.body.biography, function(user, err) {
		if(err) {
			console.log(err.cause);
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('User updated');
		}
	});
});

router.delete('/account/:id', function(req, res) {
	users.remove(req.params.id, function(err) {
		if(err) {
			console.log(err.cause);
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('User removed');
		}
	});
});

module.exports = router;