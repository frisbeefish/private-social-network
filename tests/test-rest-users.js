"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('People', function() {

    it('- get all people', function(done) {
        httputils.get('/api/users', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- gets one person', function(done) {
        httputils.get('/api/users/1', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- gets one person messages', function(done) {
        httputils.get('/api/users/123/messages', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- gets one person posts', function(done) {
        httputils.get('/api/users/123/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- gets one person discussions', function(done) {
        httputils.get('/api/users/1/discussions', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- creates a user', function(done) {
        httputils.postJson('/api/users', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a user', function(done) {
        httputils.putJson('/api/users/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a user', function(done) {
        httputils.deleteJson('/api/users/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- gets all recent activity for users', function(done) {
        httputils.get('/api/users/recent-activity', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- gets one user recent activity for users', function(done) {
        httputils.get('/api/users/123/recent-activity', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- send message to user', function(done) {
        httputils.postJson('/api/users/123/inbox', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });


});