'use strict';

var mongoose = require('mongoose');
var shortId = require('shortid');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

module.exports = function (users) {

	var userSchema = new mongoose.Schema(
    {
        _id: String,
    	email: String,
        password: String,
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
        
        signup: function signup(email, password, firstname, lastname, biography, callback) {
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
                    password: bcrypt.hashSync(password),
                    firstname: firstname,
                    lastname: lastname,
                    registrationDate: new Date().toJSON().slice(0,10), 
                    biography: biography ? biography : ''
                });
                return userToAdd.save(function(err, createdUser) {
                    if(err) {
                        return callback(null, {
                            status: 500,
                            cause: 'Problem creating user : ' + err
                        });
                    }
                    var token = jwt.sign(createdUser, 'aabbcc', {
                        expiresIn : 60*60*24
                    });
                    return callback({ user: createdUser, token: token }, null);
                });
    		});
        },

        login: function login(email, password, callback) {
            collectionUsers.findOne({email: email}, function(err, user) {
                if (err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(user) {
                    return bcrypt.compare(password, user.password, function(err, res) {
                        if(res) {
                            var token = jwt.sign(user, 'aabbcc', {
                                expiresIn : 60*60*24
                            });
                            return callback({ user: user, token: token }, null);
                        }
                        return callback(null, {
                            status: 401,
                            cause: 'Authentification failed, incorrect password'
                        });
                    });
                }
                return callback(null, {
                    status: 404,
                    cause: 'User not found'
                });
            });
        },

        update: function update(id, newFirstname, newLastname, newBiography, callback) {
            collectionUsers.findOne({_id: id}, function(err, user) {
                if (err) {
                    return callback(null, {
                        status: 500,
                        cause: 'Error occured: ' + err
                    });
                }
                if(user) {
                    if(newFirstname) user.firstname = newFirstname;
                    if(newLastname) user.lastname = newLastname;
                    if(newBiography) user.biography = newBiography;
                    return user.save(function(err, userUpdated) {
                        if(err) {
                            return callback(null, {
                                status: 500,
                                cause: 'Problem modifying user : ' + err
                            });
                        }
                        return callback(userUpdated, null);
                    });
                }
                return callback(null, {
                    status: 404,
                    cause: 'User not found'
                });
            });
        },

        remove: function remove(id, callback) {
            collectionUsers.findOneAndRemove({_id: id}, function(err, user) {
                if (err) {
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
        },

        scopeTestOnly : {
            collectionUsers: collectionUsers
        }
    };

    return Users;
};