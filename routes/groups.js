'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');

var groups = require ('../config').groups;
var users = require('../config').users;

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

router.get('/groups', function(req, res) {
    groups.getAll(function(groups, err) {
        if(err) {
            console.log(err.cause);
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(groups);
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
		res.status(401).send('Required name/admin');
	} else {
        users.exists(req.body.idAdmin, function(exists, err) {
            if(err) {
                    console.log(err.cause);
                    res.status(err.status).send(err.cause);
            } else {
                if(exists) {
                    groups.create(req.body.name, req.body.description, req.body.idAdmin, function(group, err){
                        if(err) {
                            res.status(err.status).send(err.cause);
                        } else {
                            res.status(200).send('Group created');
                        }
                    });
                } else {
                    res.status(404).send('User not found');
                }
            }
        });
	}
});

router.put('/groups/join/:groupId', function(req, res) {
    users.exists(req.body.userId, function(exists, err1) {
        if(err1) {
            console.log(err1.cause);
            res.status(err1.status).send(err1.cause);
        } else {
            if(exists) {
                groups.join(req.body.userId, req.params.groupId, function(err2) {
                    if(err2) {
                        res.status(err2.status).send(err2.cause);
                    } else {
                        res.status(200).send('Group joined');
                    }
                });
            } else {
                res.status(404).send('User not found');
            }
        }
    });
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
	groups.update(req.params.id, req.body.name, req.body.description, function(user, err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).send('Group updated');
		}
	});
});

router.delete('/groups/:groupId/members/:userId', function(req, res) {
    groups.removeMember(req.params.userId, req.params.groupId, function(err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).send('User removed');
        }
    });
});

router.get('/groups/members/:userId', function(req, res) {
    users.exists(req.params.userId, function(exists, err1) {
        if(err1) {
            console.log(err1.cause);
            res.status(err1.status).send(err1.cause);
        } else {
            if(exists) {
                groups.findGroupByMember(req.params.userId, function(groups, err) {
                    if(err) {
                        res.status(err.status).send(err.cause);
                    } else {
                        res.status(200).json(groups);
                    }
                });
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});

module.exports = router;