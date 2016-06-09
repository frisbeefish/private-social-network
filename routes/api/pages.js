"use strict";


//
// This monkey patches the router so that it will catch many exceptions and expose them through
// an 'error' event that is emitted by the app.
//
var router = require('../utils').Router();

var Errors = require('../../utils').Errors;
var NotImplementedError = Errors.NotImplementedError;


//
// The Data Service(s)
//
var PagesDS = require('../../dataServices').Pages;


///////////////////////////////////////////////////////////////////////////////////
//
// The Routes.
//
// NOTE: All the routes use data services to access the models and/or other services to do non-model based business logic.
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns the pages (meta data for the website pages) for the current community.
 *
 * Example Url GET: /api/pages
 */
router.get('/', function(req, res, next) {
    PagesDS.list(req.communityId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(pages) {
        res.json(pages);
    }).catch( err => next(err));
});


/**
 * Returns a specific page.
 *
 * Example Url GET: /api/pages/123
 */
router.get('/:id', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.get(req.communityId,pageId).then(function(page) {
        res.json(page);
    }).catch( err => next(err));
});


/**
 * Returns the sub pages of a specific page.
 *
 * Example Url GET: /api/pages/123/sub-pages
 */
router.get('/:id/sub-pages', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.subPages(req.communityId,pageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(subPages) {
        res.json(subPages);
    }).catch( err => next(err));
});


/**
 * Returns a single sub page.
 *
 * Example Url GET: /api/pages/123/sub-pages/456
 */
router.get('/:id/sub-pages/:subPageId', function(req, res, next) {
    var pageId = req.params.id;
    var subPageId = req.params.subPageId;
    PagesDS.getSubPage(req.communityId,pageId,subPageId).then(function(subPage) {
        res.json(subPage);
    }).catch( err => next(err));
});


/**
 * Returns the components/posts of a single sub page.
 *
 * Example Url GET: /api/pages/123/sub-pages/456/posts
 */
router.get('/:id/sub-pages/:subPageId/posts', function(req, res, next) {
    var pageId = req.params.id;
    var subPageId = req.params.subPageId;
    PagesDS.subPagePosts(req.communityId,pageId,subPageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(subPage) {
        res.json(subPage);
    }).catch( err => next(err));
});


/**
 * Returns all of the posts for an entire page.
 *
 * Example Url GET: /api/pages/123/posts
 */
router.get('/:id/posts', function(req, res, next) {
    var pageId = req.params.id;
    PagesDS.posts(req.communityId,pageId,parseInt(req.query.offset),parseInt(req.query.limit)).then(function(messages) {
        res.json(messages);
    }).catch( err => next(err));
});


/**
 * Returns a single page post.
 *
 * Example Url GET: /api/pages/123/posts
 */
router.get('/:id/posts/:pagePostId', function(req, res, next) {
    var pageId = req.params.id;
    var pagePostId = req.params.pagePostId;
    PagesDS.getPagePost(req.communityId,pageId,pagePostId).then(function(post) {
        res.json(post);
    }).catch( err => next(err));
});


/**
 * Returns the subposts of a single post (these would be files in a "files" post or images in a "gallery" post).
 *
 * Example Url GET: /api/pages/123/posts/456/subposts
 */
router.get('/:id/posts/:pagePostId/subposts', function(req, res, next) {
    var pageId = req.params.id;
    var pagePostId = req.params.pagePostId;
    PagesDS.getPagePostSubposts(req.communityId,pageId,pagePostId).then(function(subposts) {
        res.json(subposts);
    }).catch( err => next(err));
});


/**
 * Creates a new page.
 *
 * Example Url POST: /api/pages
 */
router.post('/', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Updates a page.
 *
 * Example Url PUT: /api/pages/123
 */
router.put('/:pageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Deletes a page.
 *
 * Example Url DELETE: /api/pages/123
 */
router.delete('/:pageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Creates a sub page.
 *
 * Example Url POST: /api/pages/123/sub-pages
 */
router.post('/:pageId/sub-pages', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Updates a sub page.
 *
 * Example Url PUT: /api/pages/123/sub-pages/456
 */
router.put('/:pageId/sub-pages/:subPageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Deletes a sub page.
 *
 * Example Url DELETE: /api/pages/123/sub-pages/456
 */
router.delete('/:pageId/sub-pages/:subPageId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Creates a new post a single sub page.
 *
 * Example Url POST: /api/pages/123/sub-pages/123/posts
 */
router.post('/:pageId/sub-pages/:subPageId/posts', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Updates a post on a sub page.
 *
 * Example Url PUT: /api/pages/123/sub-pages/123/posts/234
 */
router.put('/:pageId/sub-pages/:subPageId/posts/:postId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Deletes a sub page post.
 *
 * Example Url DELETE: /api/pages/123/sub-pages/123/posts/234
 */
router.delete('/:pageId/sub-pages/:subPageId/posts/:postId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Creates a subpost on a post. For instance, creates a file in a "files" post or an image
 * in a "gallery" post.
 *
 * Example Url POST: /api/pages/123/sub-pages/123/posts/324/subposts 
 */
router.post('/:pageId/sub-pages/:subPageId/posts/:postId/subposts', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Updates the subpost of a post.
 *
 * Example Url PUT: /api/pages/123/sub-pages/123/posts/324/subposts
 */
router.put('/:pageId/sub-pages/:subPageId/posts/:postId/subposts/:subPostId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


/**
 * Deletes a subpost of a post.
 *
 * Example Url DELETE: /api/pages/123/sub-pages/123/posts/324/subposts
 */
router.delete('/:pageId/sub-pages/:subPageId/posts/:postId/subposts/:subPostId', function(req, res, next) {
    next(new NotImplementedError(req.protocol + '://' + req.get('host') + req.originalUrl))
});


module.exports = router;

