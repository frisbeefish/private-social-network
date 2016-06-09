
"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('Communities', function() {

    it('- get all communities', function(done) {
        httputils.get('/api/communities', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one community', function(done) {
        httputils.get('/api/communities/1', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community calendar', function(done) {
        httputils.get('/api/communities/1/calendar', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('CALENDAR: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- get community discussions', function(done) {
        httputils.get('/api/communities/1/discussions', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community discussion categories', function(done) {
        httputils.get('/api/communities/1/discussion-categories', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community pages', function(done) {
        httputils.get('/api/communities/1/pages', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community posts', function(done) {
        httputils.get('/api/communities/1/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community users', function(done) {
        httputils.get('/api/communities/1/users', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community admins', function(done) {
        httputils.get('/api/communities/1/admins', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get community group user', function(done) {
        httputils.get('/api/communities/1/group-user', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- creates a community', function(done) {
        httputils.postJson('/api/communities', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a community', function(done) {
        httputils.putJson('/api/communities/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a community', function(done) {
        httputils.deleteJson('/api/communities/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });



});