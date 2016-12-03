'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var auth = require('../tools/authentification');
var jwt = require('jsonwebtoken');

var groups = require ('../config').groups;
var users = require('../config').users;

router.get('/groups/:id', function(req, res) {
    groups.get(req.params.id, function(group, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(group);
        }
    });
});

router.get('/groups', function(req, res) {
    groups.getAll(function(groups, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(groups);
        }
    });
});

router.delete('/groups/:id', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
	groups.remove(req.params.id, user, function(err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(204).send();
		}
	});
});

router.post('/groups/create', auth.ensureAuthorized, function(req, res) {
	if(!req.body.name || !req.body.idAdmin) {
		res.status(401).send('Required name/admin');
	} else {
        users.exists(req.body.idAdmin, function(exists, err) {
            if(err) {
                res.status(err.status).send(err.cause);
            } else {
                if(exists) {
                    groups.create(req.body.name, req.body.description, req.body.idAdmin, function(group, err){
                        if(err) {
                            res.status(err.status).send(err.cause);
                        } else {
                            res.status(200).json(group);
                        }
                    });
                } else {
                    res.status(404).send('User not found');
                }
            }
        });
	}
});

router.put('/groups/join/:groupId', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
    users.exists(req.body.userId, function(exists, err1) {
        if(err1) {
            res.status(err1.status).send(err1.cause);
        } else {
            if(exists) {
                groups.join(req.body.userId, req.params.groupId, user, function(err2) {
                    if(err2) {
                        res.status(err2.status).send(err2.cause);
                    } else {
                        res.status(204).send();
                    }
                });
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});

router.get('/groups/:id/admin', auth.ensureAuthorized, function(req, res) {
    groups.getAdmin(req.params.id, function(admin, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(admin);
        }
    });
});

router.put('/groups/:id', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
	groups.update(req.params.id, req.body.name, req.body.description, user, function(group, err) {
		if(err) {
			res.status(err.status).send(err.cause);
		} else {
			res.status(200).json(group);
		}
	});
});

router.delete('/groups/:groupId/members/:userId', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
    groups.removeMember(req.params.userId, req.params.groupId, user, function(err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(204).send();
        }
    });
});

router.get('/groups/members/:userId', auth.ensureAuthorized, function(req, res) {
    users.exists(req.params.userId, function(exists, err1) {
        if(err1) {
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

router.post('/groups/:groupId/comments/create', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
    if(!req.params.groupId || !req.body.message || !req.body.authorId) {
		res.status(401).send('Required group/message/author');
	} else {
        users.exists(req.body.authorId, function(exists, err) {
            if(err) {
                    res.status(err.status).send(err.cause);
            } else {
                if(exists) {
                    groups.addComment(req.params.groupId, req.body.message, req.body.authorId, user, function(comment, err){
                        if(err) {
                            res.status(err.status).send(err.cause);
                        } else {
                            res.status(200).json(comment);
                        }
                    });
                } else {
                    res.status(404).send('User not found');
                }
            }
        });
	}
});

router.get('/groups/:groupId/comments', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
    groups.isMemberOf(req.params.groupId, user._id, function(result, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            if(result) {
                groups.getComments(req.params.groupId, function(comments, err) {
                    if(err) {
                        res.status(err.status).send(err.cause);
                    } else {
                        res.status(200).json(comments);
                    }
                });
            } else {
                res.status(403).send('You don\'t have the right to do that');
            }
        }
    });
});

router.get('/groups/:groupId/comments/:commentId', auth.ensureAuthorized, function(req, res) {
    var user = _.get(jwt.decode(req.token, {complete: true}), 'payload._doc');
    groups.isMemberOf(req.params.groupId, user._id, function(result, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            if(result) {
                groups.getComment(req.params.groupId, req.params.commentId, function(comment, err) {
                    if(err) {
                        res.status(err.status).send(err.cause);
                    } else {
                        res.status(200).json(comment);
                    }
                });
            } else {
                res.status(403).send('You don\'t have the right to do that');
            }
        }
    });
    
});

module.exports = router;