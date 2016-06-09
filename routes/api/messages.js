"use strict";

//var express = require('express');
//var router = express.Router();

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// the 'uncaughtException' error stream from the process.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;



///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns messages from the logged-in user's inbox.
 *
 * Example Url GET: /api/messages/inbox
 */
router.get('/inbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Gets a single inbox message.
 *
 * Example Url GET: /api/messages/inbox/123
 */
router.get('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Retrieves replies to a single inbox message.
 *
 * Example Url GET: /api/messages/inbox/123/replies
 */
router.get('/inbox/:messageId/replies', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Reply to an inbox message.
 *
 * Example Url POST: /api/messages/inbox/123/replies
 */
router.post('/inbox/:messageId/replies', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Move a message from the inbox to the "saved" folder.
 *
 * Example Url PATCH: /api/messages/inbox/123
 */
router.patch('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Delete a message from the inbox.
 *
 * Example Url DELETE: /api/messages/inbox/123
 */
router.delete('/inbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Retrieve list of sent messages.
 *
 * Example Url GET: /api/messages/outbox
 */
router.get('/outbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Send a message.
 *
 * Example Url POST: /api/messages/outbox
 */
router.post('/outbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Get one outbox message.
 *
 * Example Url GET: /api/messages/outbox/123
 */
router.get('/outbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Delete a message from the outbox.
 *
 * Example Url DELETE: /api/messages/outbox/123
 */
router.delete('/outbox/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Retrieve saved messages.
 *
 * Example Url GET: /api/messages/saved
 */
router.get('/saved', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Get one saved message.
 *
 * Example Url GET: /api/messages/saved/123
 */
router.get('/saved/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Delete a saved message.
 *
 * Example Url DELETE: /api/messages/inbox
 */
router.delete('/saved/:messageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


module.exports = router;