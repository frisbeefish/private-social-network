var express = require('express');
var router = express.Router();
var User = require('../models').User.model;

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log('User: ' + User);
    console.log(JSON.stringify(User));

//User.where('user_id', 1).fetch({withRelated:['messages']}).then(function(user) {
User.where('user_id', 1).fetch().then(function(user) {

  console.log(user.toJSON()); //.related('posts').toJSON());

    /*
    user.messages().fetch().then(function(messages) {
        console.log('HAVE MESSAGES');
        console.log(messages.toJSON());
    }).catch(function(err) {
        console.error(err);
    }) 
   */

    user.messagesInCommunity(1).then(function(messages) {
        console.log('HAVE MESSAGES');
        console.log(messages.toJSON());
    }).catch(function(err) {
        console.error(err);
    }) 


}).catch(function(err) {

  console.error(err);

});

  res.render('index', { title: 'Express' });
});

module.exports = router;
