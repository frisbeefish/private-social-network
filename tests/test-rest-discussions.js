
"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('Discussions', function() {

    it('- get all discussions', function(done) {
        httputils.get('/api/discussions', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one discussion', function(done) {
        httputils.get('/api/discussions/771', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- do not get non-existing discussion', function(done) {
        httputils.get('/api/discussions/1', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            console.error('NON EXIST DISCUSSION BODY: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- get one discussion comments', function(done) {
        httputils.get('/api/discussions/771/comments', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get  discussions recent activity', function(done) {
        httputils.get('/api/discussions/recent-activity', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get  discussions categories', function(done) {
        httputils.get('/api/discussions/categories', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            //console.error('BODY: ' + JSON.stringify(res.body));
            done();
        });
    });

    var discussionId = null;

    it('- creates a discussion', function(done) {
        httputils.postJson('/api/discussions', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            discussionId = res.body.discussion_id;
            console.error('Created discussion: ' + JSON.stringify(res.body));
            console.error('ID: ' + discussionId);
            done();
        });
    });

    it('- updates an INVALID discussion', function(done) {
        httputils.putJson('/api/discussions/999' + discussionId, {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Discussion not found');
            done();
        });
    });

    it('- updates a discussion', function(done) {
        httputils.putJson('/api/discussions/' + discussionId, {title:'NEW STYLE updated from test',body:'the updated body'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('UPDATED discussion: ' + JSON.stringify(res.body));
            done();
        });
    });


    let discussionCommentId = null;

    it('- creates a discussion comment', function(done) {
        httputils.postJson('/api/discussions/' + discussionId + '/comments', {comment:'FIRST COMMENT my comment is thus'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            discussionCommentId = res.body.discussion_comment_id;
            console.error('NEW DISCUSSION COMMENT: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- creates a second discussion comment', function(done) {
        httputils.postJson('/api/discussions/' + discussionId + '/comments', {comment:'SECOND COMMENT my comment is thus'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('NEW DISCUSSION COMMENT: ' + JSON.stringify(res.body));
            done();
        });
    });

/*

    it('- get one discussion comment', function(done) {
        httputils.get('/api/discussions/771/comments/123', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });
*/


    it('- deletes a discussion comment', function(done) {
        httputils.deleteJson('/api/discussions/' + discussionId + '/comments/' + discussionCommentId, {}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });



    it('- deletes a discussion', function(done) {
        httputils.deleteJson('/api/discussions/' + discussionId, {}, function(err, res, body) {
            console.error('RESULTS: ' + res);
            console.error(JSON.stringify(res));
            expect(res.statusCode).to.equal(200);
            done();
        });
    });


});