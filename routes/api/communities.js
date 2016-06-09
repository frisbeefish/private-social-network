
"use strict";

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// an 'error' event that is emitted by the app.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;
var NotFoundError = Errors.NotFoundError;

//
// The Data Service(s)
//
var CommunitiesDS = require('../../dataServices').Communities;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns a list of communities.
 *
 * Example Url GET: /api/communities
 */
router.get('/', function(req, res, next) {
    CommunitiesDS.list(parseInt(req.query.offset),parseInt(req.query.limit)).then(function(communities) {
        res.json(communities);
    }).catch( err => next(err));
});


/**
 * Returns a single community.
 *
 * Example Url GET: /api/communities/123
 */
router.get('/:id', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.get(communityId).then(function(user) {
        res.json(user);
    }).catch( err => next(err));
});


/**
 * Returns the calendar for a a single community.
 *
 * Example Url GET: /api/communities/123/calendar
 */
router.get('/:id/calendar', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.calendar(communityId).then(function(posts) {
        res.json(posts);
    }).catch( err => next(err));
});


/**
 * Returns the discussions posted to a single community.
 *
 * Example Url GET: /api/communities/123
 */
router.get('/:id/discussions', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.discussions(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussions) {
        res.json(discussions);
    }).catch( err => next(err));
});


/**
 * Returns the discussion categories defined within a single community.
 *
 * Example Url GET: /api/communities/123
 */
router.get('/:id/discussion-categories', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.discussionCategories(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussionCategories) {
        res.json(discussionCategories);
    }).catch( err => next(err));
});


/**
 * Returns the pages (meta data for the website pages) for a single community.
 *
 * Example Url GET: /api/communities/123/pages
 */
router.get('/:id/pages', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.pages(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(pages) {
        res.json(pages);
    }).catch( err => next(err));
});


/**
 * Returns the posts that were posted within a single community.
 *
 * Example Url GET: /api/communities/123/posts
 */
router.get('/:id/posts', function(req, res, next) {
    var communityId = req.params.id;
    console.log('POSTS req.query.limit: ' + req.query.limit);
    CommunitiesDS.posts(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(posts) {
        res.json(posts);
    }).catch( err => next(err));
});


/**
 * Returns the members of a single community.
 *
 * Example Url GET: /api/communities/123/users
 */
router.get('/:id/users', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.users(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


/**
 * Returns the admins of a single community.
 *
 * Example Url GET: /api/communities/123/admins
 */
router.get('/:id/admins', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.admins(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


/**
 * Returns the "group user" of a single community. This is an invisible user that is used as the owner of the
 * community's calendar. This exists for historical reasons. The system originally allowed each user to have their
 * own calendar and for there to be a "group" calendar for all users. But to simplify the product, I removed the
 * per-user calendars and only kept a group calendar shared by all members of the community.
 *
 * Example Url GET: /api/communities/123/group-user
 */
router.get('/:id/group-user', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.groupUser(communityId).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


/**
 * Create a new community.
 *
 * Example Url POST: /api/communities
 */
router.post('/', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Update a community.
 *
 * Example Url PUT: /api/communities/123
 */
router.put('/:communityId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Delete a community.
 *
 * Example Url DELETE: /api/communities/123
 */
router.delete('/:communityId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});




module.exports = router;

