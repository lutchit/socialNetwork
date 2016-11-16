'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');

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

router.delete('/groups/:id', function(req, res) {
	groups.remove(req.params.id, function(err) {
		if(err) {
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

router.post('/groups/:groupId/comments/create', function(req, res) {
    if(!req.params.groupId || !req.body.message || !req.body.authorId) {
		res.status(401).send('Required group/message/author');
	} else {
        users.exists(req.body.authorId, function(exists, err) {
            if(err) {
                    res.status(err.status).send(err.cause);
            } else {
                if(exists) {
                    groups.addComment(req.params.groupId, req.body.message, req.body.authorId, function(err){
                        if(err) {
                            res.status(err.status).send(err.cause);
                        } else {
                            res.status(200).send('Comment created');
                        }
                    });
                } else {
                    res.status(404).send('User not found');
                }
            }
        });
	}
});

router.get('/groups/:groupId/comments', function(req, res) {
    groups.getComments(req.params.groupId, function(comments, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(comments);
        }
    });
});

router.get('/groups/:groupId/comments/:commentId', function(req, res) {
    groups.getComment(req.params.groupId, req.params.commentId, function(comment, err) {
        if(err) {
            res.status(err.status).send(err.cause);
        } else {
            res.status(200).json(comment);
        }
    });
});

module.exports = router;