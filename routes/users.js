"use strict";

var express = require('express');
var router = express.Router();

//
// The Data Service(s)
//
var UsersDS = require('../dataServices').Users;


//
// The Routes.
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//

router.get('/', function(req, res, next) {
    UsersDS.list(parseInt(req.query.offset),parseInt(req.query.limit)).then(function(users) {
        res.json(users);
    }).catch( err => next(err));
});

router.get('/:id', function(req, res, next) {
    var user_id = req.params.id;
    UsersDS.get(user_id).then(function(user) {
        res.json(user);
    }).catch( err => next(err));
});

router.get('/:id/messages', function(req, res, next) {
    var userId = req.params.id;
    UsersDS.messages(userId,req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


router.get('/:id/posts', function(req, res, next) {
    var userId = req.params.id;
    UsersDS.posts(userId,req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});

router.get('/:id/discussions', function(req, res, next) {
    var userId = req.params.id;
    UsersDS.discussions(userId,req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


module.exports = router;

