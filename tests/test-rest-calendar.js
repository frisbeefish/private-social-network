"use strict";

//
// Run tests from command line with watch: DB_USER=root NODE_ENV=test ./node_modules/.bin/mocha -w tests/**
//

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var httputils = require('./utils');


describe('Calendar', function() {

    //
    // Getting, creating, etc. calendars.
    //

    describe('- Calendar', function() {

        it('- get all calendars', function(done) {
            httputils.get('/api/calendars', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('- get calendar for year and month', function(done) {
            httputils.get('/api/calendars/2012/8', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('- get calendar for year and month and day', function(done) {
            httputils.get('/api/calendars/2012/8/14', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });


        it('- search calendar', function(done) {
            httputils.postJson('/api/calendars/search', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });


    });

    //
    // Create, update, delete calendar events.
    //

    describe('- Events', function() {

/*
        it('- Get all calendar events', function(done) {
            httputils.get('/api/calendars/2012/8', function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });
*/

        var createdCalendarEventId = null;

        it('- create calendar event', function(done) {
            httputils.postJson('/api/calendars/2012/9/events', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                //console.error('BODY: ' + res.body.message);
                createdCalendarEventId = res.body.calendar_event_id;
                done();
            });
        });

        it('- Update calendar event', function(done) {
            httputils.putJson('/api/calendars/2016/1/events/' + createdCalendarEventId, {}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                console.error('AFT UPDATE BODY: ' + res.body);
                console.error('BODY: ' + JSON.stringify(res.body));

               // expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });


        it('- Delete calendar event', function(done) {
            console.error('before delete createdCalendarEventId: ' + createdCalendarEventId);
            httputils.deleteJson('/api/calendars/2016/1/events/' + createdCalendarEventId, {}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                console.error('after delete BODY: ' + JSON.stringify(res.body));
                done();
            });
        });


        it('- uploads a calendar image', function(done) {
            httputils.postForm('/api/calendars/2016/5/events/images', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

    });


    describe('- Event Attendees', function() {

        it('- Get all calendar event attendees', function(done) {
            httputils.get('/api/calendars/2016/1/events/123/attendees', function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

        it('- Get calendar attendee', function(done) {
            httputils.get('/api/calendars/2016/1/events/123/attendees/123', function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

        it('- Add calendar attendee', function(done) {
            httputils.postJson('/api/calendars/2016/1/events/123/attendees', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

        it('- Update calendar attendee', function(done) {
            httputils.putJson('/api/calendars/2016/1/events/123/attendees/123', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

        it('- Delete calendar attendee', function(done) {
            httputils.deleteJson('/api/calendars/2016/1/events/123/attendees/123', {}, function(err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(res.body.message).to.include('Not Implemented');
                done();
            });
        });

    });


});