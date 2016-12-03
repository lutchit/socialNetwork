'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var groups = require('../../config').groups;
var users = require('../../config').users;

chai.use(chaiHttp);

var memberToken = '';
var member2Token = '';
var adminToken = '';

describe('Group route', function() {

    mongoose.connection.collections.groups.drop();
    
    before(function(done){
        var cryptedPwd = bcrypt.hashSync('password');
        var adminToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testAdminId',
            email: 'test@test.fr',
            password: cryptedPwd,
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        adminToAdd.save(function(err) {
            users.login('test@test.fr', 'password', function(res, err) {
                if(err) {
                    console.log('Error authenticating admin account for tests');
                } else {
                    adminToken = res.token;
                }
            });
        });
        var memberToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'testMemberId',
            email: 'test2@test.fr',
            password: cryptedPwd,
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        memberToAdd.save(function(err) {
            users.login('test2@test.fr', 'password', function(res, err) {
                if(err) {
                    console.log('Error authenticating member account for tests');
                } else {
                    memberToken = res.token;
                }
            });
        });
        var member2ToAdd = new users.scopeTestOnly.collectionUsers({
            _id: 'test2MemberId',
            email: 'test3@test.fr',
            password: cryptedPwd,
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        member2ToAdd.save(function(err) {
            users.login('test3@test.fr', 'password', function(res, err) {
                if(err) {
                    console.log('Error authenticating member 2 account for tests');
                } else {
                    member2Token = res.token;
                }
            });
        });
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

    it('should return a single group on /api/groups/:id GET', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:id GET when group not exists', function(done) {
        chai.request(server)
        .get('/api/groups/falseId')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return all groups on /api/groups GET', function(done) {
        chai.request(server)
        .get('/api/groups')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(1);
            done();
        });
    });

    it('should return the admin of a group on /api/groups/:id/admin GET', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/admin')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:id/admin GET when group not exists', function(done) {
        chai.request(server)
        .get('/api/groups/falseGroupId/admin')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should modify a group on /api/groups/:id PUT', function(done) {
        chai.request(server)
        .put('/api/groups/testGroupId')
        .set('x-access-token', adminToken)
        .send({
            name: 'newTestGroup'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:id PUT when group not exists', function(done) {
        chai.request(server)
        .put('/api/groups/falseId')
        .set('x-access-token', adminToken)
        .send({
            name: 'newTestGroup'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add a member on /api/groups/join/:groupId PUT', function(done) {
        chai.request(server)
        .put('/api/groups/join/testGroupId')
        .set('x-access-token', memberToken)
        .send({
            userId: 'testMemberId'
        })
        .end(function(err, res){
            res.should.have.status(204);
            done();
        });
    });

    it('should return a 409 error on /api/groups/join/:groupId PUT when member is already in group', function(done) {
        chai.request(server)
        .put('/api/groups/join/testGroupId')
        .set('x-access-token', memberToken)
        .send({
            userId: 'testMemberId'
        })
        .end(function(err, res){
            res.should.have.status(409);
            done();
        });
    });

    it('should return a 404 error on /api/groups/join/:groupId PUT when user not exists', function(done) {
        chai.request(server)
        .put('/api/groups/join/testGroupId')
        .set('x-access-token', memberToken)
        .send({
            userId: 'falseMemberId'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /api/groups/join/:groupId PUT when group not exists', function(done) {
        chai.request(server)
        .put('/api/groups/join/falseGroupId')
        .set('x-access-token', memberToken)
        .send({
            userId: 'testMemberId'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return the groups for which an user is a member of on /api/groups/members/:userId GET', function(done) {
        chai.request(server)
        .get('/api/groups/members/testMemberId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(1);
            done();
        });
    });

    it('should return a 404 error on /api/groups/members/:userId GET when user not exists', function(done) {
        chai.request(server)
        .get('/api/groups/members/falseMemberId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return the comments for a group on /api/groups/:groupId/comments GET', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/comments')
        .set('x-access-token', memberToken) 
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(2);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/comments GET when group not exists', function(done) {
        chai.request(server)
        .get('/api/groups/falseGroupId/comments')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:groupId/comments GET when user is not in the group', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/comments')
        .set('x-access-token', member2Token)
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should return a comment for a group on /api/groups/:groupId/comments/:commentId GET', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/comments/idComment1')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:groupId/comments GET when user is not in the group', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/comments')
        .set('x-access-token', member2Token)
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/comments/:commentId GET when group not exists', function(done) {
        chai.request(server)
        .get('/api/groups/falseGroupId/comments/idComment1')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/comments/:commentId GET when comment not exists', function(done) {
        chai.request(server)
        .get('/api/groups/testGroupId/comments/falseIdComment')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should add a comment on /api/groups/:groupId/comments/create POST', function(done) {
        chai.request(server)
        .post('/api/groups/testGroupId/comments/create')
        .set('x-access-token', memberToken)
        .send({
            authorId: 'testMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/comments/create POST when group not exists', function(done) {
        chai.request(server)
        .post('/api/groups/falseGroupId/comments/create')
        .set('x-access-token', memberToken)
        .send({
            authorId: 'testMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:groupId/comments/create POST when user doesn\'t have the rights', function(done) {
        chai.request(server)
        .post('/api/groups/testGroupId/comments/create')
        .set('x-access-token', member2Token)
        .send({
            authorId: 'testMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/comments/create POST when user not exists', function(done) {
        chai.request(server)
        .post('/api/groups/testGroupId/comments/create')
        .set('x-access-token', memberToken)
        .send({
            authorId: 'falseMemberId',
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 401 error on /api/groups/:groupId/comments/create POST when a field is missing', function(done) {
        chai.request(server)
        .post('/api/groups/testGroupId/comments/create')
        .set('x-access-token', memberToken)
        .send({
            message: 'This is the third message'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should delete a member group on /api/groups/:groupId/members/:userId DELETE', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId/members/testMemberId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(204);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:groupId/members/:userId DELETE when trying to remove the admin', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId/members/testAdminId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:groupId/members/:userId DELETE when trying to remove a member without rights', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId/members/testMemberId')
        .set('x-access-token', member2Token)
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/members/:userId DELETE when group not exists', function(done) {
        chai.request(server)
        .delete('/api/groups/falseGroupId/members/testMemberId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:groupId/members/:userId DELETE when user not exists', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId/members/falseMemberId')
        .set('x-access-token', adminToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 404 error on /api/groups/:id DELETE when group not exists', function(done) {
        chai.request(server)
        .delete('/api/groups/falseId')
        .set('x-access-token', adminToken)
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
    });

    it('should return a 403 error on /api/groups/:id DELETE when not good rights', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId')
        .set('x-access-token', memberToken)
        .end(function(err, res){
            res.should.have.status(403);
            done();
        });
    });

    it('should delete a group on /api/groups/:id DELETE', function(done) {
        chai.request(server)
        .delete('/api/groups/testGroupId')
        .set('x-access-token', adminToken)
        .end(function(err, res){
            res.should.have.status(204);
            done();
        });
    });

    it('should add a group on /api/groups/create POST', function(done) {
        chai.request(server)
        .post('/api/groups/create')
        .set('x-access-token', memberToken)
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

    it('should return a 401 error when adding a group without name on /api/groups/create POST', function(done) {
        chai.request(server)
        .post('/api/groups/create')
        .set('x-access-token', memberToken)
        .send({
            description: 'test',
            idAdmin: 'testAdminId'
        })
        .end(function(err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should return a 404 error when adding a group without an existing user admin on /api/groups/create POST', function(done) {
        chai.request(server)
        .post('/api/groups/create')
        .set('x-access-token', memberToken)
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