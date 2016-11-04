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
	}, { _id: false });
	var collectionGroups = mongoose.model('groups', groupSchema);
  	
  	var Groups = {
        
        get: function get(id, callback) {
            collectionGroups.findOne({_id: id}, function(err, group) {
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
                if (groups.length > 0) {
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
                }
                return callback(null, {
                    status: 404,
                    cause: 'No groups'
                });
            });
        },

        create: function create(name, description, idAdmin, callback) {
            var groupToCreate = new collectionGroups({
                _id: shortId.generate(),
                name: name,
                description: description ? description : '',
                admin: idAdmin,
                members: []
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
            collectionGroups.findOne({_id: id}, function(err, group) {
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
            collectionGroups.findOne({_id: groupdId}).populate('admin').exec(function(err, group) {
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

        remove: function remove(groupdId, callback) {
            collectionGroups.findOneAndRemove({_id: groupdId}, function(err, group) {
                if (err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
                    return callback(null);
                }
                return callback({
                    status: 404,
                    cause: 'Group not found'
                });
            });
        },

        join: function join(userId, groupId, callback) {
            collectionGroups.findOne({_id: groupId}, function(err, group) {
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

        removeMember: function removeMember(userId, groupId, callback) {
            collectionGroups.findOne({_id: groupId}, function(err, group) {
                if(err) {
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(group) {
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
        }
    };

    return Groups;
};