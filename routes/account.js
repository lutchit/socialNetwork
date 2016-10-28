var express = require('express');
var router = express.Router();
var users = require ("../config").users;

router.post('/account/signup', function(req, res) {
	if(!req.body.email || !req.body.firstname || !req.body.surname) {
		res.status(401).send("Required email/firstname/surname");
	} else {
		users.signup(req.body.email, req.body.firstname, req.body.surname, req.body.biography, function(user, err){
			if(err) {
				console.log(err.cause);
				res.status(err.status).send(err.cause);
			} else {
                res.status(200).send('User created');
			}
		});
	}
});

module.exports = router;