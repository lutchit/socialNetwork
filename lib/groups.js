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

        create: function create(name, description, idAdmin, callback) {
            var groupToCreate = new collectionGroups({
                _id: shortId.generate(),
                name: name,
                description: description ? description : '',
                admin: idAdmin,
                members: []
            });
            groupToCreate.save(function(err, createdGroup) {
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
                if(newName) group.name = newName;
                if(newDescription) group.description = newDescription;
                group.save(function(err, userUpdated) {
                    if(err) {
                        return callback(null, {
                            status: 500,
                            cause: 'Problem modifying group : ' + err
                        });
                    }
                    return callback(userUpdated, null);
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
        }
    };

    return Groups;
};