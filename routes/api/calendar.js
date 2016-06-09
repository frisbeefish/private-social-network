
"use strict";

//var express = require('express');
//var router = express.Router();

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// an 'error' event that is emitted by the app.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;

//var Community = require('../models').Community;

//
// The Data Service(s)
//
var CalendarDS = require('../../dataServices').Calendar;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /api/calendar
 */
router.get('/', function(req, res, next) {
    let communityId = req.communityId;
    CalendarDS.get(req.communityId).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});


/**
 * Returns the calendar for a specific month within a specific year.
 *
 * Example Url GET: /api/calendar/2016/5
 */
router.get('/:year/:month', function(req, res, next) {
    let communityId = req.communityId;
    let month = req.params.month;
    let year = req.params.year;
    CalendarDS.getCalendarForMonth(req.communityId,month,year).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});


/**
 * Returns the calendar events for a specific week within a specific month within a specific year.
 *
 * Example Url GET: /api/calendar/2016/5/weeks/1
 */
router.get('/:year/:month/weeks/:week', function(req, res, next) {
    let communityId = req.communityId;
    let week = req.params.week;
    let month = req.params.month;
    let year = req.params.year;
    CalendarDS.getCalendarForMonth(req.communityId,month,year).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});


/**
 * Get the calendar events for a specific date.
 *
 * Example Url GET: /calendar/2016/5/15
 */
router.get('/:year/:month/:dayInMonth(\\d+)/', function (req, res, next) {
    let communityId = req.communityId;
    let dayInMonth = req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    CalendarDS.getCalendarForDay(req.communityId,dayInMonth,month,year).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});


/**
 * Add a calendar event.
 *
 * Example Url POST: /calendar/2016/5/events
 */
router.post('/:year/:month/events', function(req, res, next) {
    
    let communityId = req.communityId;
    let userId = req.userId;
    let dayInMonth = 1; //req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    console.error('IN POST, MONTH: ' + month);
    CalendarDS.createCalendarEvent(req.communityId,userId,dayInMonth,month,year,{}).then(function(calendarEvent) {
        res.json(calendarEvent);
    }).catch( err => {
        next(err);
    });
});


/**
 * Update a calendar event.
 *
 * Example Url PUT: /calendar/2016/5/events/123
 */
router.put('/:year/:month/events/:eventId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let dayInMonth = 1; //req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    let eventId = req.params.eventId;
    CalendarDS.updateCalendarEvent(req.communityId,userId,eventId,{}).then(function(event) {
        res.json(event);
    }).catch( err => {
        next(err);
    });

});


/**
 * Delete a calendar event.
 *
 * Example Url DELETE: /calendar/2016/5/events/123
 */
router.delete('/:year/:month/events/:eventId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let dayInMonth = 1; //req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    let eventId = req.params.eventId;
    console.error('IN POST, MONTH: ' + month);
    CalendarDS.deleteCalendarEvent(req.communityId,userId,eventId).then(function() {
        res.json({success:true});
    }).catch( err => {
        console.error('ERROR: ' + err);
        next(err);
    });
});


/**
 * Upload a calendar event image.
 *
 * Example Url POST: /calendar/2016/5/events/images
 */
router.post('/:year/:month/events/images', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Returns a list of the attendees of a calendar event.
 *
 * Example Url GET: /calendar/2016/5/events/123/attendees
 */
router.get('/:year/:month/events/:eventId/attendees', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Returns single calendar event attendee
 *
 * Example Url GET: /calendar/2016/5/events/123/attendees/456
 */
router.get('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Adds a new attendee to a calendar event.
 *
 * Example Url POST: /calendar/2016/5/events/123/attendees
 */
router.post('/:year/:month/events/:eventId/attendees', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Update a calendar event attendee.
 *
 * Example Url PUT: /calendar/2016/5/events/123/attendees/456
 */
router.put('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Remove a calendar event attendee.
 *
 * Example Url DELETE: /calendar/2016/5/events/123/attendees/456
 */
router.delete('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Search for calendar events.
 *
 * Example Url GET: /api/calendar/search
 */
router.post('/search', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});



module.exports = router;