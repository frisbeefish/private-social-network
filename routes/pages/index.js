

"use strict";

//
// This monkey patches the router so that it will catch many exceptions and expose them through
// the 'uncaughtException' error stream from the process.
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
 * Returns the home page
 *
 * Example Url GET: /
 */
router.get('/', function(req, res, next) {
    res.send('home page');
});

/**
 * Returns the about page
 *
 * Example Url GET: /about
 */
router.get('/about', function(req, res, next) {
    res.send('about page');
});

/**
 * Returns the private pages page
 *
 * Example Url GET: /private-pages
 */
router.get('/private-pages', function(req, res, next) {
    res.send('private pages page');
});

/**
 * Returns the public pages page
 *
 * Example Url GET: /public-pages
 */
router.get('/public-pages', function(req, res, next) {
    res.send('public pages page');
});


/**
 * Returns the posts page
 *
 * Example Url GET: /posts
 */
router.get('/posts', function(req, res, next) {
    res.send('posts page');
});


/**
 * Returns the discussions page
 *
 * Example Url GET: /discussions
 */
router.get('/discussions', function(req, res, next) {
    res.send('discussions page');
});


/**
 * Returns the calendar page
 *
 * Example Url GET: /calendar
 */
router.get('/calendar', function(req, res, next) {
    res.send('calendar page');
});


/**
 * Returns the messages page
 *
 * Example Url GET: /messages
 */
router.get('/messages', function(req, res, next) {
    res.send('messages page');
});

/**
 * Returns the people page
 *
 * Example Url GET: /people
 */
router.get('/people', function(req, res, next) {
    res.send('people page');
});


/**
 * Returns the profile page
 *
 * Example Url GET: /profile
 */
router.get('/profile', function(req, res, next) {
    res.send('profile page');
});


/**
 * Returns the admin page
 *
 * Example Url GET: /admin
 */
router.get('/admin', function(req, res, next) {
    res.send('admin page');
});


module.exports = router;

