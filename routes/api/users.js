"use strict";

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// the 'uncaughtException' error stream from the process.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;

//
// The Data Service(s)
//
var UsersDS = require('../../dataServices').Users;



///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////



/**
 * Returns a list of users for the current community from the database.
 *
 * Example Url GET: /api/users
 */
router.get('/', function(req, res, next) {
    let communityId = req.communityId;
    UsersDS.list(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


/**
 * Returns a specified user from the database.
 *
 * Example Url GET: /api/users/123
 */
router.get('/:userId(\\d+)/', function (req, res, next) {
    let communityId = req.communityId;
    var userId = req.params.userId;
    UsersDS.get(communityId,userId).then(function(user) {
        res.json(user);
    }).catch( err => next(err));
});


/**
 * Returns the discussions posted by a specified user from the database.
 *
 * Example Url GET: /api/users/123/discussions
 */
router.get('/:userId/discussions', function(req, res, next) {
    var userId = req.params.userId;
    UsersDS.discussions(req.communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


/**
 * Returns the posts posted by a specified user from the database.
 *
 * Example Url GET: /api/users/123/posts
 */
router.get('/:userId/posts', function(req, res, next) {
    var userId = req.params.userId;
    UsersDS.posts(req.communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


/**
 * Returns the messages posted by a specified user from the database.
 *
 * Example Url GET: /api/users/123/messages
 */
router.get('/:userId/messages', function(req, res, next) {
    var userId = req.params.userId;
    UsersDS.messages(req.communityId,userId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


/**
 * Creates a new user.
 *
 * Example Url POST: /api/users
 */
router.post('/', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Updates an existing user.
 *
 * Example Url PUT: /api/users/123
 */
router.put('/:userId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Deletes an exisitng user (and any related data).
 *
 * Example Url DELETE: /api/users/123
 */
router.delete('/:userId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Returns all the recent user activity for the current community.
 *
 * Example Url GET: /api/users/recent-activity
 */
router.get('/recent-activity', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Returns all the recent activity of a specific user within the current community.
 *
 * Example Url GET: /api/users/123/recent-activity
 */
router.get('/:userId/recent-activity', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Sends an email message to a specific user.
 *
 * Example Url POST: /api/users/123/inbox
 */
router.post('/:userId/inbox', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});



module.exports = router;

