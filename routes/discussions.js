
"use strict";

var express = require('express');
var router = express.Router();

var PostEntry = require('../models').PostEntry;

//
// The Data Service(s)
//
var DiscussionsDS = require('../dataServices').Discussions;


//
// The Routes.
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//


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


module.exports = router;

