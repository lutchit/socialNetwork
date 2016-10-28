var mongoose = require('mongoose');

module.exports = function (users) {

	var userSchema = new mongoose.Schema(
    {
    	email: String,
        firstname: String,
        lastname: String,
        registrationDate: Date,
        biography: String
	});
	var collectionUsers = mongoose.model('users', userSchema);
  	
  	var Users = {
        
        signup: function signup(email, firstname, lastname, biography, callback) {
            collectionUsers.findOne({email: email}, function(err, user) {
        		if (err) {
            		callback(null, {
                		status: 500,
                		cause: "Error occured: " + err
	          		});
    		    } else {
        		    if (user) {
        		    	callback(null, {
        		        	status: 409,
        		        	cause: "User already exist"
        		        });
		            } else {					
        		        var userToAdd = new collectionUsers({ 
                            email: email, 
                            firstname: firstname,
                            lastname: lastname,
                            registrationDate: new Date().toJSON().slice(0,10), 
                            biography: biography
                        });
        		        userToAdd.save(function(err, createdUser) {
        		        	if(err) {
        		        		callback(null, {
                					status: 500,
                					cause: "Problem adding user : " + err
	          					});
                			} else {
                                callback(createdUser, null);
                    		}
                		});
            		}	
        		}
    		});
        }
    };

    return Users;
};