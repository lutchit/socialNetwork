'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');

var groups = require ("../config").groups;

router.get('/groups/:id', function(req, res) {
    groups.get(req.params.id, function(group, err) {
        if(err) {
            console.log(err.cause);
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(group);
        }
    });
});

router.delete('/groups/:id', function(req, res) {
	groups.remove(req.params.id, function(err) {
		if(err) {
			console.log(err.cause);
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('Group removed');
		}
	});
});

router.post('/groups/create', function(req, res) {
	if(!req.body.name || !req.body.idAdmin) {
		res.status(401).send("Required name/admin");
	} else {
		groups.create(req.body.name, req.body.description, req.body.idAdmin, function(group, err){
			if(err) {
				console.log(err.cause);
				res.status(err.status).send(err.cause);
			} else {
                res.status(200).send('Group created');
			}
		});
	}
});

router.get('/groups/:id/admin', function(req, res) {
    groups.getAdmin(req.params.id, function(admin, err) {
        if(err) {
            console.log(err.cause);
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).send(admin);
        }
    });
});

router.put('/groups/:id', function(req, res) {
    console.log(req.body.name);
    console.log(req.body.description);
	groups.update(req.params.id, req.body.name, req.body.description, function(user, err) {
		if(err) {
			console.log(err.cause);
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('Group updated');
		}
	});
});

module.exports = router;