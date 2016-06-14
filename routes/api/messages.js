"use strict";

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// an 'error' event that is emitted by the app.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;


//
// The Data Service(s)
//
var MessagesDS = require('../../data_services').Messages;



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
    let communityId = req.communityId;
    let userId = req.userId;

    MessagesDS.inboxMessages(communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Gets a single inbox message.
 *
 * Example Url GET: /api/messages/inbox/123
 */
router.get('/inbox/:messageId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let messageId = req.params.messageId;

    MessagesDS.getInboxMessage(messageId).then(function(message) {
        res.json(message);
    }).catch( err => {
        next(err) 
    });
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
 * Send a message.
 *
 * Example Url POST: /api/messages/outbox
 */
router.post('/outbox', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;

    let subject = req.body.subject; 
    let body = req.body.body; 
    let to = req.body.to; 

    MessagesDS.sendMessage(communityId,userId,to,subject,body).then(function(message) {
        res.json(message);
    }).catch( err => {
        next(err) 
    });
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
    let communityId = req.communityId;
    let userId = req.userId;

    MessagesDS.outboxMessages(communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => {
        next(err) 
    });
/*
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
*/
});




/**
 * Get one outbox message.
 *
 * Example Url GET: /api/messages/outbox/123
 */
router.get('/outbox/:messageId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let messageId = req.params.messageId;

    MessagesDS.getOutboxMessage(messageId).then(function(message) {
        res.json(message);
    }).catch( err => {
        next(err) 
    });


   // next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
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

    let communityId = req.communityId;
    let userId = req.userId;

    MessagesDS.outboxMessages(communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => {
        next(err) 
    });

    //next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Get one saved message.
 *
 * Example Url GET: /api/messages/saved/123
 */
router.get('/saved/:messageId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let messageId = req.params.messageId;

    MessagesDS.getSavedMessage(messageId).then(function(message) {
        res.json(message);
    }).catch( err => {
        next(err) 
    });


 //   next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
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