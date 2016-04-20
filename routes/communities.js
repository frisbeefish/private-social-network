
"use strict";

var express = require('express');
var router = express.Router();

var Errors = require('../utils').Errors;

var Community = require('../models').Community;

//
// The Data Service(s)
//
var CommunitiesDS = require('../dataServices').Communities;


//
// The Routes.
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//


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

router.get('/:id/discussionCategories', function(req, res, next) {
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

router.get('/:id/groupUser', function(req, res, next) {
    var communityId = req.params.id;
    CommunitiesDS.groupUser(communityId).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});


module.exports = router;

