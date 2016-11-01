'use strict';

var mongoose = require('mongoose');
var shortId = require('shortid');
var _ = require('lodash');

module.exports = function (users) {

	var userSchema = new mongoose.Schema(
    {
        _id: String,
    	email: String,
        firstname: String,
        lastname: String,
        registrationDate: Date,
        biography: String
	}, { _id: false });
	var collectionUsers = mongoose.model('users', userSchema);
  	
  	var Users = {

        get: function get(id, callback) {
            collectionUsers.findOne({_id: id}, function(err, user) {
                if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                if (user) {
        		    return callback(user, null);
                }
                return callback(null, {
                    status: 404,
                    cause: 'User not found'
                });
            });
        },
        
        signup: function signup(email, firstname, lastname, biography, callback) {
            collectionUsers.findOne({email: email}, function(err, user) {
        		if (err) {
            		return callback(null, {
                		status: 500,
                		cause: 'Error occured: ' + err
	          		});
    		    }
                if (user) {
        		    return callback(null, {
                        status: 409,
                        cause: 'User already exist'
                    });
                }
                var userToAdd = new collectionUsers({
                    _id: shortId.generate(),
                    email: email, 
                    firstname: firstname,
                    lastname: lastname,
                    registrationDate: new Date().toJSON().slice(0,10), 
                    biography: biography ? biography : ''
                });
                userToAdd.save(function(err, createdUser) {
                    if(err) {
                        return callback(null, {
                            status: 500,
                            cause: 'Problem adding user : ' + err
                        });
                    }
                    return callback(createdUser, null);
                });
    		});
        },

        update: function update(id, newEmail, newFirstname, newLastname, newBiography, callback) {
            collectionUsers.findOne({_id: id}, function(err, user) {
                if (err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(newEmail) user.email = newEmail;
                if(newFirstname) user.firstname = newFirstname;
                if(newLastname) user.lastname = newLastname;
                if(newBiography) user.biography = newBiography;
                user.save(function(err, userUpdated) {
                    if(err) {
                        return callback(null, {
                            status: 500,
                            cause: 'Problem modifying user : ' + err
                        });
                    }
                    return callback(userUpdated, null);
                });
            });
        },

        remove: function remove(id, callback) {
            collectionUsers.findOneAndRemove({_id: id}, function(err, user) {
                if (err) {
                    console.log(err);
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(user) {
                    return callback(null);
                }
                return callback({
                    status: 404,
                    cause: 'User not found'
                });
            });
        },

        exists: function exists(id, callback) {
            collectionUsers.findOne({_id: id}, function(err, user) {
                if (err) {
                    console.log(err);
                    return callback({
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(user) {
                    return callback(true, null);
                }
                return callback(false, null);
            });
        }
    };

    return Users;
};