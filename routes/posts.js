
"use strict";

var express = require('express');
var router = express.Router();

var PostEntry = require('../models').PostEntry;

//
// The Data Service(s)
//
var PostsDS = require('../dataServices').Posts;


//
// The Routes.
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//


router.get('/', function(req, res, next) {
    PostsDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(communities) {
        res.json(communities);
    }).catch( err => next(err));
});

//
// Only match if the id is an int. Otherwise, this should not grab urls like '/recent-activity'
//
router.get('/:id(\\d+)/', function (req, res, next){
    let postEntryId = req.params.id;
    PostsDS.get(req.communityId,postEntryId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});

router.get('/:id/comments', function(req, res, next) {
    let postEntryId = req.params.id;
    PostsDS.comments(req.communityId,postEntryId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});

router.get('/recent-activity', function(req, res, next) {
    PostsDS.recentActivity(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(recentActivity) {
        res.json(recentActivity);
    }).catch( err => next(err));
});


module.exports = router;

