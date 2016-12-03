'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var users = require('../../config').users;

var token = '';

chai.use(chaiHttp);

describe('Account route', function() {

    mongoose.connection.collections.users.drop();
    
    before(function(done){
        var cryptedPwd = bcrypt.hashSync('password');
        var userToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testId',
            email: 'test@test.fr',
            password: cryptedPwd,
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
        done();
    });

    it('should return a 401 error on /api/account/authenticate POST when password is missing', function(done) {
        chai.request(server)
        .post('/api/account/authenticate')
        .send({
            'email': 'test@test.fr'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 401 error on /api/account/authenticate POST when password is incorrect', function(done) {
        chai.request(server)
        .post('/api/account/authenticate')
        .send({
            'email': 'test@test.fr',
            'password': 'falsePassword'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a token on /api/account/authenticate POST', function(done) {
        chai.request(server)
        .post('/api/account/authenticate')
        .send({
            'email': 'test@test.fr',
            'password': 'password'
        })
        .end(function(err, res){
            res.should.have.status(200);
            token = res.body.token;
            done();
        });
    });

    it('should return a 401 error on /api/account/:id GET when token is not true', function(done) {
        chai.request(server)
        .get('/api/account/testId')
        .set('x-access-token', 'token')
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 401 error on /api/account/:id GET when token is missing', function(done) {
        chai.request(server)
        .get('/api/account/testId')
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a single user on /api/account/:id GET', function(done) {
        chai.request(server)
        .get('/api/account/testId')
        .set('x-access-token', token)
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/account/:id GET when user not exists', function(done) {
        chai.request(server)
        .get('/api/account/falseId')
        .set('x-access-token', token)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add an user on /api/account/signup POST', function(done) {
        chai.request(server)
        .post('/api/account/signup')
        .send({
            'email': 'test2@test.fr',
            'password': 'password',
            'firstname': 'test2',
            'lastname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 401 error when adding an user without email on /api/account/signup POST', function(done) {
        chai.request(server)
        .post('/api/account/signup')
        .send({
            'password': 'password',
            'firstname': 'test2',
            'lastname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 409 error when adding an existing user on /api/account/signup POST', function(done) {
        chai.request(server)
        .post('/api/account/signup')
        .send({
            'email': 'test2@test.fr',
            'password': 'password',
            'firstname': 'test2',
            'lastname': 'test2'
        })
        .end(function(err, res){
            res.should.have.status(409);
            done();
        });
    });

    it('should modify an user on /api/account/:id PUT', function(done) {
        chai.request(server)
        .put('/api/account/testId')
        .set('x-access-token', token)
        .send({
            'email': 'newMail@test.fr',
            'firstname': 'newName',
            'lastname': 'newLastname',
            'biography': 'new biography'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/account/:id PUT when user not exists', function(done) {
        chai.request(server)
        .put('/api/account/falseId')
        .set('x-access-token', token)
        .send({
            'email': 'newMail@test.fr',
            'firstname': 'newName',
            'lastname': 'newLastname'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should delete an user on /api/account/:id DELETE', function(done) {
        chai.request(server)
        .delete('/api/account/testId')
        .set('x-access-token', token)
        .end(function(err, res){
            res.should.have.status(204);
            done();
        });
    });

    it('should return a 404 error on /api/account/:id DELETE when user not exists', function(done) {
        chai.request(server)
        .delete('/api/account/falseId')
        .set('x-access-token', token)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });
});