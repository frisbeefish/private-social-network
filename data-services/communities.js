"use strict";

const MAIN_MODEL = 'Community';
const DISCUSSION_CATEGORY_MODEL = 'DiscussionCategory';

var DiscussionsDS = require('./discussions');
var PagesDS = require('./pages');
var PostsDS = require('./posts');
var UsersDS = require('./users');

var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;

//var Community = require('../models').Community;

var dbGetList = require('./db-adapter').list;
var dbGetOne = require('./db-adapter').get;
var dbInsert = require('./db-adapter').insert;
var dbUpdate = require('./db-adapter').update;
var dbDelete = require('./db-adapter').deleteRow;
var dbTransaction = require('./db-adapter').withTransaction;


module.exports = {

   /**
    * Returns a list of all communities.
    *
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the communities as a a collection of {Model}.
    */
   list(offset, limit) {

      offset = offset || 0;
      limit = limit || 10;

      return dbGetList(
         MAIN_MODEL, // Model (the db table)
         [], // The where clause
         [
            ["network_name", "asc"]
         ], // The order by clause
         {},
         offset, limit
      );
   },

   /**
    * Returns a community based on its id.
    *
    * @param {number} communityId - The id of the community to return.
    *
    * @return {Promise} A promise that returns a {Model} for the returned community.
    */
   get(communityId) {

      return dbGetOne(MAIN_MODEL, [
         ['community_id', '=', communityId]
      ])

      //
      // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
      //
      .catch(function(err) {
         return Promise.reject(new Errors.NotFoundError('No community found with the specified id'));
      });
   },

   /**
    * Returns the calendar for the community.
    *
    * @param {number} communityId - The id of the community whose calendar should be returned.
    *
    * @return {Promise} A promise that returns a {Model} for the returned calendar.
    */
   calendar(communityId) {
      return dbGetOne(MAIN_MODEL, [
         ['community_id', '=', communityId]
      ])

      //
      // Return the group calendar.
      //
      .then(function(community) {
         return community.groupCalendar(); 
      })

      //
      // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
      //
      .catch(function(err) {
        return Promise.reject(new Errors.NotFoundError('No community found with the specified id'));
      });
   },

   /**
    * Returns a list of all discussion categories for a community.
    *
    * @param {number} communityId - The id of the community whose discussion categories should be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the discussion categories as a a collection of {Model}.
    */
   discussionCategories(communityId, offset, limit) {

      offset = offset || 0;
      limit = limit || 10;

      return dbGetList(
         DISCUSSION_CATEGORY_MODEL,            // Model (the db table)
         [['community_id', '=', communityId]], // The where clause
         [ ["name", "asc"] ],                  // The order by clause
         {},
         offset, limit
      );
   },

   /**
    * Returns a list of discussions for the specific community.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the discussions as a a collection of {Model}.
    */
   discussions(communityId, offset, limit) {
      return DiscussionsDS.list(communityId, offset, limit);
   },

   /**
    * Returns a list of pages for the specific community.
    *
    * @param {number} communityId - The id of the community whose pages will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the pages as a a collection of {Model}.
    */
   pages(communityId, offset, limit) {
      return PagesDS.list(communityId, offset, limit);
   },


   /**
    * Returns a list of posts for the specified community.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the posts as a a collection of {Model}.
    */
   posts(communityId, offset, limit) {
      return PostsDS.list(communityId, offset, limit);
   },

   /**
    * Returns a list of users for the specified community.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the users as a a collection of {Model}.
    */
   users(communityId, offset, limit) {
      return UsersDS.list(communityId, offset, limit);
   },

   /**
    * Returns a list of admins for the specified community.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    *
    * @return {Promise} A promise that returns the admins as a a collection of {Model}.
    */
   admins(communityId) {

      return dbGetOne(MAIN_MODEL, [
         ['community_id', '=', communityId]
      ])

      //
      // Return the group calendar.
      //
      .then(function(community) {
         return community.adminsSorted()
         .then(function(admins) {
            let adminsWithoutPasswords = admins.toJSON().map((admin) => {
               admin = omit(admin, 'password');
               return admin;
            });
            return Promise.resolve(adminsWithoutPasswords);
         })
      })

      //
      // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
      //
      .catch(function(err) {
        return Promise.reject(new Errors.NotFoundError('No community found with the specified id'));
      });
   },

   /**
    * Returns the group user for the specified community.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    *
    * @return {Promise} A promise that returns the group user for the community as a {Model}.
    */
   groupUser(communityId) {

      return dbGetOne(MAIN_MODEL, [
         ['community_id', '=', communityId]
      ])

      //
      // Return the group user.
      //
      .then(function(community) {
         return community.groupUser()
         .then(function(user) {
            return Promise.resolve(omit(user, 'password'));
         })
      })

      //
      // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
      //
      .catch(function(err) {
        return Promise.reject(new Errors.NotFoundError('No community found with the specified id'));
      });
   },
}