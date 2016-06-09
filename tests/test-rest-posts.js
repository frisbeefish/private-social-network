
"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('Posts', function() {

    it('- get all posts', function(done) {
        httputils.get('/api/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one post', function(done) {
        httputils.get('/api/posts/3405', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- do not get non-existing post', function(done) {
        httputils.get('/api/posts/1', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('- get one post comments', function(done) {
        httputils.get('/api/posts/3405/comments', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get posts recent activity', function(done) {
        httputils.get('/api/posts/recent-activity', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    let postEntryId = null;

    it('- creates a post', function(done) {
        httputils.postJson('/api/posts', {postType:'1',title:'the post title',body:'the post body'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            postEntryId = res.body.post_entry_id;
            console.error('Created post: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- updates an INVALID post', function(done) {
        httputils.putJson('/api/posts/999' + postEntryId, {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Post not found');
            done();
        });
    });

    it('- updates a VALID post', function(done) {
        httputils.putJson('/api/posts/' + postEntryId, {title:'NEW STYLE updated from test',body:'the updated body'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('UPDATED post: ' + JSON.stringify(res.body));
            done();
        });
    });

    let postEntryCommentId = null;

    it('- creates a post comment', function(done) {
        httputils.postJson('/api/posts/' + postEntryId + '/comments', {comment:'FIRST COMMENT my comment is thus'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            postEntryCommentId = res.body.post_entry_comment_id;
            console.error('NEW DISCUSSION COMMENT: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- creates a second post comment', function(done) {
        httputils.postJson('/api/posts/' + postEntryId + '/comments', {comment:'SECOND COMMENT my comment is thus'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('NEW DISCUSSION COMMENT: ' + JSON.stringify(res.body));
            done();
        });
    });


    it('- deletes a post comment', function(done) {
        httputils.deleteJson('/api/posts/' + postEntryId + '/comments/' + postEntryCommentId, {}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- deletes a post', function(done) {
        httputils.deleteJson('/api/posts/' + postEntryId, {}, function(err, res, body) {
            console.error('RESULTS: ' + res);
            console.error(JSON.stringify(res));
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

});