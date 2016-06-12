
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
var DiscussionsDS = require('../../data_services').Discussions;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns a list of discussions for the current community.
 *
 * Example Url GET: /api/discussions
 */
router.get('/', function(req, res, next) {
    DiscussionsDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussions) {
        res.json(discussions);
    }).catch( err => next(err));
});


/**
 * Retrieve a single discussion. (Regex Note: Only match if the id is an int. Otherwise, this should not grab urls 
 * like '/recent-activity')
 *
 * Example Url GET: /api/discussions/123
 */
router.get('/:id(\\d+)/', function (req, res, next){
    let discussionId = req.params.id;
    DiscussionsDS.get(req.communityId,discussionId).then(function(discussion) {
        res.json(discussion);
    }).catch( err => next(err));
});


/**
 * Retrieve a the comments for a discussion.
 *
 * Example Url GET: /api/discussions/123/comments
 */
router.get('/:id/comments', function(req, res, next) {
    let discussionId = req.params.id;
    DiscussionsDS.comments(req.communityId,discussionId).then(function(comments) {
        res.json(comments);
    }).catch( err => next(err));
});


/**
 * Returns the current community's recent discussions and comments on discussions.
 *
 * Example Url GET: /api/discussions/recent-activity
 */
router.get('/recent-activity', function(req, res, next) {
    DiscussionsDS.recentActivity(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(recentActivity) {
        res.json(recentActivity);
    }).catch( err => next(err));
});


/**
 * Retrieve the list of discussion categories defined within this community.
 *
 * Example Url GET: /api/discussions/categories
 */
router.get('/categories', function(req, res, next) {    
    DiscussionsDS.categories(req.communityId).then(function(categories) {
        res.json(categories);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Create a discussion.
 *
 * Example Url POST: /api/discussions
 */
router.post('/', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let title = 'SCOTT NEW STYLIE the title';
    let body = 'the body';
    let discussionCategoryId = 1;

    DiscussionsDS.createDiscussion(communityId,userId,title,body,discussionCategoryId).then(function(discussion) {
        res.json(discussion);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Update a discussion.
 *
 * Example Url PUT: /api/discussions/123
 */
router.put('/:discussionId', function(req, res, next) {

    console.error(' UPDATED DISCUSSION ROUTE: ' + JSON.stringify(req.body));

    let communityId = req.communityId;
    let userId = req.userId;
    let title = req.body.title; //'SCOTT UPDATED the title';
    let body = req.body.body; //'UPDATED the body';
    let discussionId = req.params.discussionId;
    let discussionCategoryId = 1;

    DiscussionsDS.updateDiscussion(communityId,userId,discussionId,title,body,discussionCategoryId).then(function(discussion) {
        res.json(discussion);
    }).catch( err => {
        next(new NotFoundError('Discussion not found')) 
    });
});


/**
 * Delete a discussion.
 *
 * Example Url DELETE: /api/discussions/123
 */
router.delete('/:discussionId', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;

    DiscussionsDS.deleteDiscussion(discussionId).then(function(response) {
        res.send(response);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Add a comment to the discussion.
 *
 * Example Url POST: /api/discussions/123/comments
 */
router.post('/:discussionId/comments', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;
    let comment = req.body.comment; //'SCOTT UPDATED the title';

    DiscussionsDS.createDiscussionComment(userId,discussionId,comment).then(function(discussionComment) {
        console.error("IT IS DONE")
        res.send(discussionComment);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Delete a discussion comment.
 *
 * Example Url DELETE: /api/discussions/123/comments
 */
router.delete('/:discussionId/comments/:discussionCommentId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;
    let discussionCommentId = req.params.discussionCommentId;

    DiscussionsDS.deleteDiscussionComment(userId,discussionId,discussionCommentId).then(function(discussion) {
        console.error("IT IS DONE")
        res.send(discussion);
    }).catch( err => {
        next(err) 
    });
});


module.exports = router;

