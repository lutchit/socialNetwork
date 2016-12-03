'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var auth = require('../tools/authentification');

var users = require ('../config').users;

router.get('/account/me', auth.ensureAuthorized, function(req, res) {
	var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
	users.get(user._id, function(user, err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).json(user);
		}
	});
});

router.get('/account/:id', auth.ensureAuthorized, function(req, res) {
	users.get(req.params.id, function(user, err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).json(user);
		}
	});
});

router.post('/account/signup', function(req, res) {
	if(!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
		res.status(401).send('Required email/password/firstname/lastname');
	} else {
		users.signup(req.body.email, req.body.password, req.body.firstname, req.body.lastname, req.body.biography, function(user, err){
			if(err) {
				res.status(err.status).send(err.cause);
			} else {
                res.status(200).send('User created');
			}
		});
	}
});

router.post('/account/authenticate', function(req, res) {
	if(!req.body.email || !req.body.password) {
		res.status(401).send('Required email/password');
	} else {
		users.login(req.body.email, req.body.password, function(token, err) {
			if(err) {
				res.status(err.status).send(err.cause);
			} else {
				res.status(200).send(token);
			}
		});
	}
});

router.put('/account/:id', auth.ensureAuthorized, function(req, res) {
	users.update(req.params.id, req.body.email, req.body.firstname, req.body.surname, req.body.biography, function(user, err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('User updated');
		}
	});
});

router.delete('/account/:id', auth.ensureAuthorized, function(req, res) {
	users.remove(req.params.id, function(err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('User removed');
		}
	});
});

module.exports = router;