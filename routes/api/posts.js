
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
var PostsDS = require('../../dataServices').Posts;



///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns a list of posts for the current community from the database.
 *
 * Example Url GET: /api/posts
 */
router.get('/', function(req, res, next) {
    PostsDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(communities) {
        res.json(communities);
    }).catch( err => next(err));
});


/**
 * Retrieve a single post. (Only match if the id is an int. Otherwise, this should not grab urls like '/recent-activity'.)
 *
 * Example Url GET: /api/posts/123
 */
router.get('/:id(\\d+)/', function (req, res, next){
    let postEntryId = req.params.id;
    PostsDS.get(req.communityId,postEntryId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});


/**
 * Return comments for a specific post
 *
 * Example Url GET: /api/posts/123/comments
 */
router.get('/:id/comments', function(req, res, next) {
    let postEntryId = req.params.id;
    PostsDS.comments(req.communityId,postEntryId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});


/**
 * Returns the current community's recent posts and comments on posts.
 *
 * Example Url GET: /api/posts/recent-activity
 */
router.get('/recent-activity', function(req, res, next) {
    PostsDS.recentActivity(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(recentActivity) {
        res.json(recentActivity);
    }).catch( err => next(err));
});


/**
 * Creates a new post in the current community
 *
 * Example Url POST: /api/posts
 */
router.post('/', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let postType = req.body.postType;
    let title = req.body.title; 
    let body = req.body.body; 

    PostsDS.createPost(communityId,userId,postType,title,body).then(function(post) {
        res.json(post);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Updates a specific post
 *
 * Example Url PUT: /api/posts/123
 */
router.put('/:postEntryId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let title = req.body.title; //'SCOTT UPDATED the title';
    let body = req.body.body; //'UPDATED the body';
    let postEntryId = req.params.postEntryId;

    PostsDS.updatePost(communityId,userId,postEntryId,title,body).then(function(post) {
        res.json(post);
    }).catch( err => {
        next(new NotFoundError('Post not found')) 
    });

});


/**
 * Deletes a post.
 *
 * Example Url DELETE: /api/posts/123
 */
router.delete('/:postEntryId', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let postEntryId = req.params.postEntryId;

    PostsDS.deletePost(postEntryId).then(function(response) {
        res.send(response);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Adds a comment to a post.
 *
 * Example Url POST: /api/posts/123/comments
 */
router.post('/:postEntryId/comments', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let postEntryId = req.params.postEntryId;
    let comment = req.body.comment; //'SCOTT UPDATED the title';

    PostsDS.createPostComment(userId,postEntryId,comment).then(function(postComment) {
        res.send(postComment);
    }).catch( err => {
        next(err) 
    });
});


/**
 * Deletes a post comment.
 *
 * Example Url DELETE: /api/posts/123/comments/456
 */
router.delete('/:postEntryId/comments/:postEntryCommentId', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let postEntryId = req.params.postEntryId;
    let postEntryCommentId = req.params.postEntryCommentId;

    PostsDS.deletePostComment(userId,postEntryId,postEntryCommentId).then(function(post) {
        res.send(post);
    }).catch( err => {
        next(err) 
    });
});


module.exports = router;

