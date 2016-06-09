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



///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


//
// Get inbox messages /messages/inbox GET
//
router.get('/inbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Get one inbox message /messages/inbox/123 GET
//
router.get('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Get replies to one message /messages/inbox/123/replies GET
//
router.get('/inbox/:messageId/replies', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Reply to one message /messages/inbox/123/replies GET
//
router.post('/inbox/:messageId/replies', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Move inbox message to saved /messages/inbox/123 PATCH
//
router.patch('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Delete one inbox message /messages/inbox/123 GET
//
router.delete('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


//
// Get outbox messages   /messages/outbox GET
//
router.get('/outbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Send message  /messages/outbox POST
//
router.post('/outbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Get one outbox message /messages/outbox/123 GET
//
router.get('/outbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Delete one outbox message /messages/outbox/123 DELETE
//
router.delete('/outbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// get saved messages  /messages/saved GET
//
router.get('/saved', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Get one saved message /messages/saved/123 GET
//
router.get('/saved/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Delete one saved message /messages/outbox/123 DELETE
//
router.delete('/saved/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


module.exports = router;