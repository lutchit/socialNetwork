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
            _id: 'testUserId',
            email: 'test@test.fr', 
            firstname: 'test',
            lastname: 'test',
            registrationDate: new Date().toJSON().slice(0,10), 
            biography: ''
        });
        adminToAdd.save();
        var groupToCreate = new groups.scopeTestOnly.collectionGroups({
            _id: 'testGroupId',
            name: 'testGroup',
            description: 'test',
            admin: 'testUserId',
            members: ['testUserId']
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
            res.should.be.json;
            done();
        });
    });

    it('should return a 404 error on /groups/:id GET when group not exists', function(done) {
        chai.request(server)
        .get('/account/falseId')
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
});