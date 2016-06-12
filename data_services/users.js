"use strict";

const MAIN_MODEL = 'User';
const COMMUNITY_MODEL = 'Community';

let CommunitiesDS = require('./communities');

//var User = require('../models').User;

var omit = require('../utils').Tools.omit;

var Errors = require('../utils').Errors;

var dbGetList = require('./db_adapter').list;
var dbGetOne = require('./db_adapter').get;
var dbInsert = require('./db_adapter').insert;
var dbUpdate = require('./db_adapter').update;
var dbDelete = require('./db_adapter').deleteRow;
var dbTransaction = require('./db_adapter').withTransaction;


///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns the specified user.
 *
 * @param {number} communityId - The id of the community whose user will be returned.
 * @param {number} userId - The id of the user to return.
 * @param {number} withRelated - (Optional) Related data to retrieve.
 *
 * @return {Promise} A promise that returns the user as a {Model}.
 */
function getOneUser(communityId, userId, withRelated) {
   withRelated = withRelated || {}

   return dbGetOne(MAIN_MODEL, [ ['user_id', '=', userId] ], // Where
      withRelated
   )

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No user found with the specified id'));
   });
}



module.exports = {

   /**
    * Returns a list of users for the specified community from the database.
    *
    * @param {number} communityId - The id of the community whose users will be returned.
    *
    * @return {Promise} A promise that returns the users as a a collection of {Model}.
    */
   list(communityId) {

      return dbGetOne(COMMUNITY_MODEL, [
         ['community_id', '=', communityId]
      ])

      .then(function(community) {
         return community.usersSorted()
      })

      .then(function(users) {
         let usersSorted = users.toJSON().map((user) => {
            return omit(user, 'password')
         });
         return Promise.resolve(usersSorted)
      })
   },

   /**
    * Returns the specified user.
    *
    * @param {number} communityId - The id of the community whose user will be returned.
    * @param {number} userId - The id of the user to return.
    * @param {number} withRelated - (Optional) Related data to retrieve.
    *
    * @return {Promise} A promise that returns the user as a {Model}.
    */
   get(communityId, userId) {
      return getOneUser(communityId, userId)

      .then(function(user) {
         return Promise.resolve(omit(user.toJSON(), 'password'))
      })
   },

   /**
    * Returns the discussions posted by the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose user's discussions will be returned.
    * @param {number} userId - The id of the user whose discussions will be returned
    *
    * @return {Promise} A promise that returns the discussions as a {Model}.
    */
   discussions(communityId, userId, offset, limit) {
      offset = offset || 0;
      limit = limit || 10;

      return getOneUser(communityId, userId)

      .then(function(user) {
         return user.discussionsInCommunity(communityId, offset, limit)
         .catch(function(err) {
            return Promise.reject(new Error('Error: ' + err))
         })
      })
         
      .catch(function(err) {
         return Promise.reject(new Errors.NotFoundError('No user found with the specified id'));
      })
   },

   /**
    * Returns the posts posted by the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose user's posts will be returned.
    * @param {number} userId - The id of the user whose posts will be returned
    *
    * @return {Promise} A promise that returns the posts as a {Model}.
    */
   posts(communityId, userId, offset, limit) {
      offset = offset || 0;
      limit = limit || 10;


      return getOneUser(communityId, userId)
      .then(function(user) {
         return user.postsInCommunity(communityId, offset, limit)
         .catch(function(err) {
            return Promise.reject(new Error('Error: ' + err))
         })
      })
      .catch(function(err) {
         return Promise.reject(new Errors.NotFoundError('No user found with the specified id'));
      })
   },


   /**
    * Returns the messages posted by the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose user's messages will be returned.
    * @param {number} userId - The id of the user whose messages will be returned
    *
    * @return {Promise} A promise that returns the messages as a {Model}.
    */
   messages(communityId, userId, offset, limit) {
      offset = offset || 0;
      limit = limit || 10;

      return getOneUser(communityId, userId)

      .then(function(user) {
         return user.messagesInCommunity(communityId, offset, limit)
         .catch(function(err) {
            return Promise.reject(new Error('Error: ' + err))
         })
      })
      .catch(function(err) {
         return Promise.reject(new Errors.NotFoundError('No user found with the specified id'));
      })
   }


}