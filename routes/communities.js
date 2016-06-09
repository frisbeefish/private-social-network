
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
var NotFoundError = Errors.NotFoundError;


//var Community = require('../models').Community;

//
// The Data Service(s)
//
var CommunitiesDS = require('../dataServices').Communities;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


router.get('/', function(req, res, next) {
    CommunitiesDS.list(parseInt(req.query.offset),parseInt(req.query.limit)).then(function(communities) {
        res.json(communities);
    }).catch( err => next(err));
});

router.get('/:id', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.get(communityId).then(function(user) {
        res.json(user);
    }).catch( err => next(err));
});


router.get('/:id/calendar', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.calendar(communityId).then(function(posts) {
        res.json(posts);
    }).catch( err => next(err));
});

router.get('/:id/discussions', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.discussions(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussions) {
        res.json(discussions);
    }).catch( err => next(err));
});

router.get('/:id/discussion-categories', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.discussionCategories(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(discussionCategories) {
        res.json(discussionCategories);
    }).catch( err => next(err));
});


router.get('/:id/pages', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.pages(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(pages) {
        res.json(pages);
    }).catch( err => next(err));
});


router.get('/:id/posts', function(req, res, next) {
    var communityId = req.params.id;
    console.log('POSTS req.query.limit: ' + req.query.limit);
    CommunitiesDS.posts(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(posts) {
        res.json(posts);
    }).catch( err => next(err));
});


router.get('/:id/users', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.users(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


router.get('/:id/admins', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.admins(communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});

router.get('/:id/group-user', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.groupUser(communityId).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});

//
// Create community    /communities    POST
//
router.post('/', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Update community    /communities/123    PUT
//
router.put('/:communityId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// Delete community    /communities/123    DELETE
//
router.delete('/:communityId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});




module.exports = router;

