'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var mongoose = require('mongoose');

var users = require('../../config').users;

chai.use(chaiHttp);

describe('Account route', function() {

    mongoose.connection.collections.users.drop();
    
    before(function(done){
        var userToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testId',
            email: 'test@test.fr', 
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        userToAdd.save(function(err) {
            done();
        });
    });

    after(function(done){
        mongoose.connection.collections.users.drop();
        // mongoose.connection.close();
        done();
    });

    it('should return a single user on /account/:id GET', function(done) {
        chai.request(server)
        .get('/account/testId')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    });

    it('should return a 404 error on /account/:id GET when user not exists', function(done) {
        chai.request(server)
        .get('/account/falseId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add an user on /account/signup POST', function(done) {
        chai.request(server)
        .post('/account/signup')
        .send({
            'email': 'test2@test.fr',
            'firstname': 'test2',
            'surname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 401 error when adding an user without email on /account/signup POST', function(done) {
        chai.request(server)
        .post('/account/signup')
        .send({
            'firstname': 'test2',
            'surname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 409 error when adding an existing user on /account/signup POST', function(done) {
        chai.request(server)
        .post('/account/signup')
        .send({
            'email': 'test2@test.fr',
            'firstname': 'test2',
            'surname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(409);
            done();
        });
    });

    it('should modify an user on /account/:id PUT', function(done) {
        chai.request(server)
        .put('/account/testId')
        .send({
            'email': 'newMail@test.fr',
            'firstname': 'newName',
            'surname': 'newSurname',
            'biography': 'new biography'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /account/:id PUT when user not exists', function(done) {
        chai.request(server)
        .put('/account/falseId')
        .send({
            'email': 'newMail@test.fr',
            'firstname': 'newName',
            'surname': 'newSurname'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should delete an user on /account/:id DELETE', function(done) {
        chai.request(server)
        .delete('/account/testId')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /account/:id DELETE when user not exists', function(done) {
        chai.request(server)
        .delete('/account/falseId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });
});