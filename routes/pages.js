"use strict";

var express = require('express');
var router = express.Router();

//
// The Data Service(s)
//
var PagesDS = require('../dataServices').Pages;


//
// The Routes.
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//

router.get('/', function(req, res, next) {
    PagesDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(pages) {
        res.json(pages);
    }).catch( err => next(err));
});

router.get('/:id', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.get(req.communityId,pageId).then(function(page) {
        res.json(page);
    }).catch( err => next(err));
});

router.get('/:id/subPages', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.subPages(req.communityId,pageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(subPages) {
        res.json(subPages);
    }).catch( err => next(err));
});

router.get('/:id/subPages/:subPageId', function(req, res, next) {
    var pageId = req.params.id;
    var subPageId = req.params.subPageId;
    PagesDS.getSubPage(req.communityId,pageId,subPageId).then(function(subPage) {
        res.json(subPage);
    }).catch( err => next(err));
});

router.get('/:id/subPages/:subPageId/posts', function(req, res, next) {
    var pageId = req.params.id;
    var subPageId = req.params.subPageId;
    PagesDS.subPagePosts(req.communityId,pageId,subPageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(subPage) {
        res.json(subPage);
    }).catch( err => next(err));
});

router.get('/:id/posts', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.posts(req.communityId,pageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});

router.get('/:id/posts/:pagePostId', function(req, res, next) {
    var pageId = req.params.id;
    var pagePostId = req.params.pagePostId;
    PagesDS.getPagePost(req.communityId,pageId,pagePostId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});

router.get('/:id/posts/:pagePostId/subposts', function(req, res, next) {
    var pageId = req.params.id;
    var pagePostId = req.params.pagePostId;
    PagesDS.getPagePostSubposts(req.communityId,pageId,pagePostId).then(function(subposts) {
        res.json(subposts);
    }).catch( err => next(err));
});

router.get('/:id/discussions', function(req, res, next) {
    var userId = req.params.id;
    UsersDS.discussions(userId,req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


module.exports = router;

