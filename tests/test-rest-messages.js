"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('Messages', function() {

    let firstMessageId = null;

    it('- get all inbox messages', function(done) {
        httputils.get('/api/messages/inbox', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            firstMessageId = body[0].id;
            //console.error('FIRST MESSAGE ID: ' + firstMessageId);
            //console.log('BODY: ' + body);
            //var messages = JSON.parse(res.body);
            //console.error(messages);
            done();
        });
    });

    it('- get one inbox message', function(done) {
        httputils.get('/api/messages/inbox/' + firstMessageId, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one INVALID inbox message', function(done) {
        httputils.get('/api/messages/inbox/123', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('No message found with the specified id');
            done();
        });
    });

    it('- move inbox message to saved', function(done) {
        httputils.patchJson('/api/messages/inbox/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- get replies to one inbox message', function(done) {
        httputils.get('/api/messages/inbox/123/replies', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- reply to inbox message', function(done) {
        httputils.postJson('/api/messages/inbox/123/replies', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- delete inbox message', function(done) {
        httputils.deleteJson('/api/messages/inbox/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });


    it('- get all outbox messages', function(done) {
        httputils.get('/api/messages/outbox', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            firstMessageId = body[0].id;
            console.log('SENT MESSAGES BODY: ' + body);
            //expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- get one outbox message', function(done) {
        httputils.get('/api/messages/outbox/' + firstMessageId, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one INVALID outbox message', function(done) {
        httputils.get('/api/messages/outbox/123', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('No message found with the specified id');
            done();
        });
    });

    it('- send message', function(done) {
        httputils.postJson('/api/messages/outbox', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- delete outbox message', function(done) {
        httputils.deleteJson('/api/messages/outbox/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });


    it('- get all saved messages', function(done) {
        httputils.get('/api/messages/saved', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            firstMessageId = body[0].id;
            //expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- get one saved message', function(done) {
        httputils.get('/api/messages/saved/' + firstMessageId, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            //expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- get one INVALID saved message', function(done) {
        httputils.get('/api/messages/saved/123', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('No message found with the specified id');
            done();
        });
    });

    it('- delete saved message', function(done) {
        httputils.deleteJson('/api/messages/saved/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });



});