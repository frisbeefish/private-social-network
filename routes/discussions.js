
"use strict";

/*
var express = require('express');
var router = express.Router();
*/

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// the 'uncaughtException' error stream from the process.
//
var router = require('./utils').Router();




/*

//router.post('/', captureExceptions( function(req, res, next) {

router.post('/', captureExceptions( function(req, res, next) {

router.post('/', function(req, res, next) {
//router.post('/', captureExceptions( function(req, res, next) {


let _post = router.post;
router.post = function() {
    console.error('IN POST WRAPPER');
    var args = Array.prototype.slice.call(arguments);
    console.error('ABOUT TO DO IT');
    try {
        var foo = 'bar';
        _post.apply(this,args);
    } catch(exc) {
       console.error('GOT ERROR IN THINGIE ' + exc);
       return process.emit('uncaughtException',exc);
    }
}
*/

//console.log('ROUTER POST: ' + router.post);



var Errors = require('../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;
var NotFoundError = Errors.NotFoundError;


//var PostEntry = require('../models').PostEntry;

//
// The Data Service(s)
//
var DiscussionsDS = require('../dataServices').Discussions;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


router.get('/', function(req, res, next) {
    DiscussionsDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussions) {
        res.json(discussions);
    }).catch( err => next(err));
});

//
// Only match if the id is an int. Otherwise, this should not grab urls like '/recent-activity'
//
router.get('/:id(\\d+)/', function (req, res, next){
    let discussionId = req.params.id;
    DiscussionsDS.get(req.communityId,discussionId).then(function(discussion) {
        res.json(discussion);
    }).catch( err => next(err));
});

router.get('/:id/comments', function(req, res, next) {
    let discussionId = req.params.id;
    DiscussionsDS.comments(req.communityId,discussionId).then(function(comments) {
        res.json(comments);
    }).catch( err => next(err));
});

router.get('/recent-activity', function(req, res, next) {
    DiscussionsDS.recentActivity(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(recentActivity) {
        res.json(recentActivity);
    }).catch( err => next(err));
});

router.get('/categories', function(req, res, next) {    
    DiscussionsDS.categories(req.communityId).then(function(categories) {
        res.json(categories);
    }).catch( err => {
        next(err) 
    });
});

/*
createDiscussion(communityId,postedByUserId,title,body,discussionCategoryId) 
*/

//
// create discussion   /discussions    POST
//
router.post('/', function(req, res, next) {
//router.post('/', captureExceptions( function(req, res, next) {
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
//}));

//
// update discussion  /discussions/123    PUT
//
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

//
// delete discussion   /discussions/123    DELETE
//
router.delete('/:discussionId', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;
   // let title = 'the title';
   // let body = 'the body';
   // let discussionCategoryId = 1;

    DiscussionsDS.deleteDiscussion(discussionId).then(function(response) {
        res.send(response);
    }).catch( err => {
        next(err) 
    });
});

//
// add discussion comment  /discussions/123/comments   POST
//
router.post('/:discussionId/comments', function(req, res, next) {
    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;
    let comment = req.body.comment; //'SCOTT UPDATED the title';
 //   let body = req.body.body; //'UPDATED the body';

    DiscussionsDS.createDiscussionComment(userId,discussionId,comment).then(function(discussionComment) {
        console.error("IT IS DONE")
        res.send(discussionComment);
    }).catch( err => {
        //console.error('ERROR CAUGHT IN ROUTE: ' + err);
        next(err) 
    });

    //next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

/*
//
// get discusion comment   /discussions/123/comments/345   GET
//
router.get('/:id/comments/:commentId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});
*/


//
// delete discussion comment   /discussions/123/comments/345   DELETE
//
router.delete('/:discussionId/comments/:discussionCommentId', function(req, res, next) {

    let communityId = req.communityId;
    let userId = req.userId;
    let discussionId = req.params.discussionId;
    let discussionCommentId = req.params.discussionCommentId;

   // deleteDiscussionComment(postedByUserId,discussionId,discussionCommentId)

    DiscussionsDS.deleteDiscussionComment(userId,discussionId,discussionCommentId).then(function(discussion) {
        console.error("IT IS DONE")
        res.send(discussion);
    }).catch( err => {
        //console.error('ERROR CAUGHT IN ROUTE: ' + err);
        next(err) 
    });


   // next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});




module.exports = router;

