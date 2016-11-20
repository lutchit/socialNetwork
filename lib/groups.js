'use strict';

var mongoose = require('mongoose');
var shortId = require('shortid');
var _ = require('lodash');

module.exports = function (groups) {

	var groupSchema = new mongoose.Schema(
    {
        _id: String,
    	name: String,
        description: String,
        admin: { type : String, ref: 'users' },
        members: [{ type : String, ref: 'users' }],
        dashboard: [{
            _id: String,
            author: String,
            message: String,
            date: Date
        }, { _id: false }]
	}, { _id: false });
	var collectionGroups = mongoose.model('groups', groupSchema);
  	
  	var Groups = {
        
        get: function get(id, callback) {
            collectionGroups.findOne({ _id: id }, function(err, group) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                if (group) {
        		    return callback(group, null);
                }
                return callback(null, {
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        getAll: function getAll(callback) {
            collectionGroups.find({}, function(err, groups) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                var formattedGroups = [];
                _.each(groups, function(group) {
                    var formattedGroup = {
                        id: group._id,
                        name: group.name,
                        description: group.description,
                        members: group.members.length
                    };
                    formattedGroups.push(formattedGroup);
                });
                return callback(formattedGroups, null);
            });
        },

        create: function create(name, description, idAdmin, callback) {
            var groupToCreate = new collectionGroups({
                _id: shortId.generate(),
                name: name,
                description: description ? description : '',
                admin: idAdmin,
                members: [idAdmin]
            });
            return groupToCreate.save(function(err, createdGroup) {
                if(err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Problem creating group : ' + err
                    });
                }
                return callback(createdGroup, null);
            });
        },

        update: function update(id, newName, newDescription, callback) {
            collectionGroups.findOne({ _id: id }, function(err, group) {
                if (err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    if(newName) group.name = newName;
                    if(newDescription) group.description = newDescription;
                    return group.save(function(err, groupUpdated) {
                        if(err) {
                            return callback(null, {
                                status: 500,
                                cause: 'Problem modifying group : ' + err
                            });
                        }
                        return callback(groupUpdated, null);
                    });
                }
                return callback(null, {
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        getAdmin: function getAdmin(groupdId, callback) {
            collectionGroups.findOne({ _id: groupdId }).populate('admin').exec(function(err, group) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                if (group) {
        		    return callback(group.admin, null);
                }
                return callback(null, {
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        remove: function remove(groupdId,  user, callback) {
            collectionGroups.findOne({ _id: groupdId }, function(err, group) {
                if (err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    if(user._id !== group.admin) {
                        return callback({
                            status: 403,
                            cause: 'You don\'t have the right to do that' 
                        });
                    }
                    return group.remove(function(err) {
                        if(err) {
                            return callback(null, {
                                status: 500,
                                cause: 'Problem deleting group : ' + err
                            });
                        }
                        return callback(null);
                    });
                }
                return callback({
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        join: function join(userId, groupId, callback) {
            collectionGroups.findOne({ _id: groupId }, function(err, group) {
                if (err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    var index = group.members.indexOf(userId);
                    if (index > -1) {
                        return callback({
                            status: 409,
                            cause: 'User is already a member of this group'
                        });
                    }
                    group.members.push(userId);
                    return group.save(function(err, groupUpdated) {
                        if(err) {
                            return callback({
                                status: 500,
                                cause: 'Problem adding member to the group : ' + err
                            });
                        }
                        return callback(null);
                    });
                }
                return callback({
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        removeMember: function removeMember(userId, groupId, user, callback) {
            collectionGroups.findOne({ _id: groupId }, function(err, group) {
                if(err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    if(group.admin === userId) {
                        return callback({
                            status: 403,
                            cause: 'Cannot remove the admin of the group'
                        }); 
                    }
                    if(user._id !== group.admin && user._id !== userId) {
                        return callback({
                            status: 403,
                            cause: 'You don\'t have the right to do that' 
                        });
                    }
                    var index = group.members.indexOf(userId);
                    if (index > -1) {
                        group.members.splice(index, 1);
                        return group.save(function(err, groupUpdated) {
                            if(err) {
                                return callback({
                                    status: 500,
                                    cause: 'Problem removing member from the group : ' + err
                                });
                            }
                            return callback(null);
                        });
                    }
                    return callback({
                        status: 404,
                        cause: 'User not in the group'
                    });
                }
                return callback({
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        findGroupByMember: function findGroupByMember(userId, callback) {
            collectionGroups.find({ members: userId }, function(err, groups) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                return callback(groups, null);
            });
        },

        addComment: function addComment(groupId, message, idAuthor, callback) {
             collectionGroups.findOne({ _id: groupId }, function(err, group) {
                if(err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    var commentToAdd = {
                        _id: shortId.generate(),
                        author: idAuthor,
                        message: message,
                        date: new Date().toJSON().slice(0, 10)
                    };
                    group.dashboard.push(commentToAdd);
                    return group.save(function(err, groupUpdated) {
                        if(err) {
                            return callback({
                                status: 500,
                                cause: 'Problem adding comment to the dashboard of the group : ' + err
                            });
                        }
                        return callback(null);
                    });
                }
                return callback({
                    status: 404,
                    cause: 'Group not found'
                });
             });
        },

        getComments: function getComments(groupId, callback) {
            collectionGroups.findOne({ _id: groupId }, function(err, group) {
                if(err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    return callback(_.reverse(group.dashboard), null);
                }
                return callback(null, {
                    status: 404,
                    cause: 'Group not found'
                });
             });
        },

        getComment: function getComment(groupId, commentId, callback) {
            collectionGroups.findOne({ _id: groupId }, function(err, group) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                if(group) {
                    var comment = _.find(group.dashboard, { _id: commentId});
                    if(comment) {
                        return callback(comment, null);
                    }
                    return callback(null, {
                        status: 404,
                        cause: 'Comment not found'
                    });
                }
                return callback(null, {
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        scopeTestOnly : {
            collectionGroups: collectionGroups
        }
    };

    return Groups;
};