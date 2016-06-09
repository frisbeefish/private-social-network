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


//
// The Data Service(s)
//
var PagesDS = require('../dataServices').Pages;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


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

router.get('/:id/sub-pages', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.subPages(req.communityId,pageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(subPages) {
        res.json(subPages);
    }).catch( err => next(err));
});

router.get('/:id/sub-pages/:subPageId', function(req, res, next) {
    var pageId = req.params.id;
    var subPageId = req.params.subPageId;
    PagesDS.getSubPage(req.communityId,pageId,subPageId).then(function(subPage) {
        res.json(subPage);
    }).catch( err => next(err));
});

router.get('/:id/sub-pages/:subPageId/posts', function(req, res, next) {
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



//
// create page   /pages    POST
//
router.post('/', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// update page  /pages/123    PUT
//
router.put('/:pageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// delete page   /pages/123    DELETE
//
router.delete('/:pageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});



//
// create sub page   /pages/123/sub-pages    POST
//
router.post('/:pageId/sub-pages', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// update sub page  /pages/123/sub-pages/123    PUT
//
router.put('/:pageId/sub-pages/:subPageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// delete subpage   /pages/123/sub-pages/123    DELETE
//
router.delete('/:pageId/sub-pages/:subPageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


//
// create sub page post  /pages/123/sub-pages/123/posts    POST
//
router.post('/:pageId/sub-pages/:subPageId/posts', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// update sub page post /pages/123/sub-pages/123/posts/234    PUT
//
router.put('/:pageId/sub-pages/:subPageId/posts/:postId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// delete subpage post  /pages/123/sub-pages/123/posts/234    DELETE
//
router.delete('/:pageId/sub-pages/:subPageId/posts/:postId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// delete subpage post  /pages/123/sub-pages/123/posts    GET
//
//router.get('/:pageId/sub-pages/:subPageId/posts', function(req, res, next) {
//    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
//});


//
// create page post subplots   /pages/123/sub-pages/123/posts/324/subposts POST
//
router.post('/:pageId/sub-pages/:subPageId/posts/:postId/subposts', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// update page post subplots   /pages/123/sub-pages/123/posts/324/subposts/123 PUT
//
router.put('/:pageId/sub-pages/:subPageId/posts/:postId/subposts/:subPostId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});

//
// delete page post subpost    /pages/123/sub-pages/123/posts/324/subposts/123 DELETE
//
router.delete('/:pageId/sub-pages/:subPageId/posts/:postId/subposts/:subPostId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


module.exports = router;

