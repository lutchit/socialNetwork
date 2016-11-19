'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var mongoose = require('mongoose');

var groups = require('../../config').groups;
var users = require('../../config').users;

chai.use(chaiHttp);

describe('Group route', function() {

    mongoose.connection.collections.groups.drop();
    
    before(function(done){
        var adminToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testAdminId',
            email: 'test@test.fr', 
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        adminToAdd.save();
        var memberToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testMemberId',
            email: 'test@test.fr', 
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        memberToAdd.save();
        var groupToCreate = new groups.scopeTestOnly.collectionGroups({
            _id: 'testGroupId',
            name: 'testGroup',
            description: 'test',
            admin: 'testAdminId',
            members: ['testAdminId'],
            dashboard: [{
                _id: 'idComment1',
                author: 'testMemberId',
                message: 'this is the first comment',
                date: new Date().toJSON().slice(0,10)
            }, {
                _id: 'idComment2',
                author: 'testAdminId',
                message: 'this is the second comment',
                date: new Date().toJSON().slice(0,10)
            }]
        });
        groupToCreate.save(function(err) {
            done();
        });
    });

    after(function(done){
        mongoose.connection.collections.users.drop();
        mongoose.connection.collections.groups.drop();
        // mongoose.connection.close();
        done();
    });

    it('should return a single group on /groups/:id GET', function(done) {
        chai.request(server)
        .get('/groups/testGroupId')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:id GET when group not exists', function(done) {
        chai.request(server)
        .get('/groups/falseId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return all groups on /groups GET', function(done) {
        chai.request(server)
        .get('/groups')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(1);
            done();
        });
    });

    it('should return the admin of a group on /groups/:id/admin GET', function(done) {
        chai.request(server)
        .get('/groups/testGroupId/admin')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:id/admin GET when group not exists', function(done) {
        chai.request(server)
        .get('/groups/falseGroupId/admin')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should modify a group on /groups/:id PUT', function(done) {
        chai.request(server)
        .put('/groups/testGroupId')
        .send({
            name: 'newTestGroup'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:id PUT when group not exists', function(done) {
        chai.request(server)
        .put('/groups/falseId')
        .send({
            name: 'newTestGroup'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add a member on /groups/join/:groupId PUT', function(done) {
        chai.request(server)
        .put('/groups/join/testGroupId')
        .send({
            userId: 'testMemberId'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/join/:groupId PUT when user not exists', function(done) {
        chai.request(server)
        .put('/groups/join/testGroupId')
        .send({
            userId: 'falseMemberId'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /groups/join/:groupId PUT when group not exists', function(done) {
        chai.request(server)
        .put('/groups/join/falseGroupId')
        .send({
            userId: 'testMemberId'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return the groups for which an user is a member of on /groups/members/:userId GET', function(done) {
        chai.request(server)
        .get('/groups/members/testMemberId')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(1);
            done();
        });
    });

    it('should return a 404 error on /groups/members/:userId GET when user not exists', function(done) {
        chai.request(server)
        .get('/groups/members/falseMemberId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return the comments for a group on /groups/:groupId/comments GET', function(done) {
        chai.request(server)
        .get('/groups/testGroupId/comments')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(2);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/comments GET when group not exists', function(done) {
        chai.request(server)
        .get('/groups/falseGroupId/comments')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a comment for a group on /groups/:groupId/comments/:commentId GET', function(done) {
        chai.request(server)
        .get('/groups/testGroupId/comments/idComment1')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/comments/:commentId GET when group not exists', function(done) {
        chai.request(server)
        .get('/groups/falseGroupId/comments/idComment1')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/comments/:commentId GET when comment not exists', function(done) {
        chai.request(server)
        .get('/groups/testGroupId/comments/falseIdComment')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add a comment on /groups/:groupId/comments/create POST', function(done) {
        chai.request(server)
        .post('/groups/testGroupId/comments/create')
        .send({
            authorId: 'testMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/comments/create POST when group not exists', function(done) {
        chai.request(server)
        .post('/groups/falseGroupId/comments/create')
        .send({
            authorId: 'testMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/comments/create POST when user not exists', function(done) {
        chai.request(server)
        .post('/groups/testGroupId/comments/create')
        .send({
            authorId: 'falseMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 401 error on /groups/:groupId/comments/create POST when a field is missing', function(done) {
        chai.request(server)
        .post('/groups/testGroupId/comments/create')
        .send({
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should delete a member group on /groups/:groupId/members/:userId DELETE', function(done) {
        chai.request(server)
        .delete('/groups/testGroupId/members/testMemberId')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/members/:userId DELETE when group not exists', function(done) {
        chai.request(server)
        .delete('/groups/falseGroupId/members/testMemberId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /groups/:groupId/members/:userId DELETE when user not exists', function(done) {
        chai.request(server)
        .delete('/groups/testGroupId/members/falseMemberId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /groups/:id DELETE when group not exists', function(done) {
        chai.request(server)
        .delete('/groups/falseId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should delete a group on /groups/:id DELETE', function(done) {
        chai.request(server)
        .delete('/groups/testGroupId')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should add a group on /groups/create POST', function(done) {
        chai.request(server)
        .post('/groups/create')
        .send({
            name: 'testGroup',
            description: 'test',
            idAdmin: 'testAdminId'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 401 error when adding a group without name on /groups/create POST', function(done) {
        chai.request(server)
        .post('/groups/create')
        .send({
            description: 'test',
            idAdmin: 'testAdminId'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 404 error when adding a group without an existing user admin on /groups/create POST', function(done) {
        chai.request(server)
        .post('/groups/create')
        .send({
            name: 'testGroup',
            description: 'test',
            idAdmin: 'falseAdminId'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });
});