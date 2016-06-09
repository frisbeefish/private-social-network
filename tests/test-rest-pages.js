"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');

describe('Pages', function() {


    it('- get all pages', function(done) {
        httputils.get('/api/pages', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one page', function(done) {
        httputils.get('/api/pages/1', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one missing page', function(done) {
        httputils.get('/api/pages/99999', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('- get one page sub pages', function(done) {
        httputils.get('/api/pages/1/sub-pages', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one page one sub page', function(done) {
        httputils.get('/api/pages/1/sub-pages/728', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- SHOULD FAIL get one page one sub page MISSING PAGE', function(done) {
        httputils.get('/api/pages/1/sub-pages/99999', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('- get one page one sub page posts', function(done) {
        httputils.get('/api/pages/1/sub-pages/728/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one page posts', function(done) {
        httputils.get('/api/pages/1/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one page one post', function(done) {
        httputils.get('/api/pages/1/posts/4815', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('- get one page one post subposts', function(done) {
        httputils.get('/api/pages/1/posts/4815/subposts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            console.error('POST SUBPOSTS: ' + JSON.stringify(res.body));
            done();
        });
    });

    it('- creates a page', function(done) {
        httputils.postJson('/api/pages', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a page', function(done) {
        httputils.putJson('/api/pages/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a page', function(done) {
        httputils.deleteJson('/api/pages/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- creates a sub page', function(done) {
        httputils.postJson('/api/pages/123/sub-pages', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a sub page', function(done) {
        httputils.putJson('/api/pages/123/sub-pages/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a sub page', function(done) {
        httputils.deleteJson('/api/pages/123/sub-pages/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });



    it('- creates a sub page post', function(done) {
        httputils.postJson('/api/pages/123/sub-pages/123/posts', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a sub page post', function(done) {
        httputils.putJson('/api/pages/123/sub-pages/123/posts/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a sub page post', function(done) {
        httputils.deleteJson('/api/pages/123/sub-pages/123/posts/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

/*
    it('- get a sub page posts', function(done) {
        httputils.get('/api/pages/123/sub-pages/123/posts', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });
*/



    it('- creates a sub page post', function(done) {
        httputils.postJson('/api/pages/123/sub-pages/123/posts/123/subposts', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- updates a sub page post', function(done) {
        httputils.putJson('/api/pages/123/sub-pages/123/posts/123/subposts/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });

    it('- deletes a sub page post', function(done) {
        httputils.deleteJson('/api/pages/123/sub-pages/123/posts/123/subposts/123', {}, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(res.body.message).to.include('Not Implemented');
            done();
        });
    });



});