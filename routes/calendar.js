
"use strict";

//var express = require('express');
//var router = express.Router();

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// the 'uncaughtException' error stream from the process.
//
var router = require('./utils').Router();

var Errors = require('../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;

//var Community = require('../models').Community;

//
// The Data Service(s)
//
var CalendarDS = require('../dataServices').Calendar;


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
 * Example Url GET: /calendar
 */
router.get('/', function(req, res, next) {
    let communityId = req.communityId;
    CalendarDS.get(req.communityId).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});




//
// Get this month calendar /calendar/2016/5    GET
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.get('/:year/:month', function(req, res, next) {
    let communityId = req.communityId;
    let month = req.params.month;
    let year = req.params.year;
    CalendarDS.getCalendarForMonth(req.communityId,month,year).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});

//
// Get the events in this month
//
/*
router.get('/:year/:month/events', function(req, res, next) {
    let communityId = req.communityId;
    let month = req.params.month;
    let year = req.params.year;
    CalendarDS.getCalendarForMonth(req.communityId,month,year).then(function(calendar) {
        res.json(calendar);
    }).catch( err => next(err));
});
*/

//
// Get the events in this week
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
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


//
// Get today calendar  /calendar/2016/5/15 GET
//
// Only match if the value after month an int. Otherwise, this should not grab urls like '/calendar/2016/5/weeks/1'
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
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

/*
//
// Get events for this calendar day
//
// Only match if the value after month an int. Otherwise, this should not grab urls like '/calendar/2016/5/weeks/1'
//
router.get('/:year/:month/:dayInMonth(\\d+)/events', function (req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


//
// Get this week calendar  /calendar/2016/5/weeks/1    GET
//
router.get('/:year/:month/weeks/:week', function(req, res, next) {
    next(new NotImplementedError())
});

//
// Get today calendar  /calendar/2016/5/15 GET
//
router.get('/:year/:month/weeks/:week', function(req, res, next) {
    next(new NotImplementedError())
});
*/


/*

TODO...
Search calendar /calendar/search    GET or POST

/calendars/2016/1

*/

//console.log('IN IT');
//
// Create a new event for this month
// Create calendar event   /calendar/2016/5/events POST
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.post('/:year/:month/events', function(req, res, next) {
    console.error('POST OF NEW EVENT');
   // next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
    
    try {
    let communityId = req.communityId;
    let userId = req.userId;
    let dayInMonth = 1; //req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    console.error('IN POST, MONTH: ' + month);
    CalendarDS.createCalendarEvent(req.communityId,userId,dayInMonth,month,year,{}).then(function(calendarEvent) {
        console.error('RECEIVED CALENDAR EVENT: ' + calendarEvent);
        res.json(calendarEvent);
    }).catch( err => {
        console.error('ERROR: ' + err);
        next(err);
    });

    } catch(exc) {
        console.error('AN EXCCEPTION: ' + exc);
    }
});

//
// Update calendar event.
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.put('/:year/:month/events/:eventId', function(req, res, next) {
   // next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))

    let communityId = req.communityId;
    let userId = req.userId;
    let dayInMonth = 1; //req.params.dayInMonth;
    let month = req.params.month;
    let year = req.params.year;
    let eventId = req.params.eventId;
    console.error('IN POST, MONTH: ' + month);
    CalendarDS.updateCalendarEvent(req.communityId,userId,eventId,{}).then(function(event) {
        //console.error('RECEIVED CALENDAR EVENT: ' + calendarEvent);
        res.json(event);
    }).catch( err => {
        console.error('ERROR: ' + err);
        next(err);
    });

});

//
// Delete calendar event   /calendar/2016/5/events/123 DELETE
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
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
        //console.error('RECEIVED CALENDAR EVENT: ' + calendarEvent);
        res.json({success:true});
    }).catch( err => {
        console.error('ERROR: ' + err);
        next(err);
    });

// { deleteCalendarEvent(communityId,creatorId,calendarEventId)
    //next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Upload calendar image   /calendar/2016/5/events/images  POST
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.post('/:year/:month/events/images', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


//
// List calendar attendees   /calendar/2016/5/events/123/attendees   GET
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.get('/:year/:month/events/:eventId/attendees', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Get calendar attendee   /calendar/2016/5/events/123/attendees/123   GET
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.get('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Add calendar attendee   /calendar/2016/5/events/123/attendees   POST
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.post('/:year/:month/events/:eventId/attendees', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Update calendar attendee   /calendar/2016/5/events/123/attendees/123   PUT
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.put('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Remove calendar attendee   /calendar/2016/5/events/123/attendees/123   DELETE
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.delete('/:year/:month/events/:eventId/attendees/:attendeeId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


//
// Search calendar /calendar/search    GET or POST
//
/**
 * Returns the calendar for the current community.
 *
 * Example Url GET: /calendar
 */
router.post('/search', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});



module.exports = router;