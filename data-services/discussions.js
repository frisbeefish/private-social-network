"use strict";

const MAIN_MODEL = 'Discussion';
const COMMENT_MODEL = 'DiscussionComment';

var moment = require('moment');
var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;

var Community = require('../models').Community;
var Discussion = require('../models').Discussion;
var DiscussionComment = require('../models').DiscussionComment;
var DiscussionCategory = require('../models').DiscussionCategory;


var dbList = require('./db-adapter').list;
var dbGetOne = require('./db-adapter').get;
var dbInsert = require('./db-adapter').insert;
var dbUpdate = require('./db-adapter').update;
var dbDelete = require('./db-adapter').deleteRow;
var dbTransaction = require('./db-adapter').withTransaction;


///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////

 
/**
 * Returns a list of discussions from the database.
 *
 * @param {number} communityId - The id of the community whose discussions will be returned.
 * @param {number} offset - (Optional) the first row (of the SELECT) to return
 * @param {number} limit - (Optional) the number of rows to return
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns the discussions as a a collection of {Model}.
 */
function getList(communityId, offset, limit, withRelated) {
   offset = offset || 0;
   limit = limit || 10;
   withRelated = withRelated || {}

   return dbList(
      MAIN_MODEL, // Model (the db table)
      [
         ['community_id', '=', communityId]
      ], // The where clause
      [
         ["creation_date_time", "desc"]
      ], // The order by clause
      withRelated, // Load these relations as well...
      offset, limit
   );
}


/**
 * Returns a discussion based on its id.
 *
 * @param {number} communityId - The id of the community whose discussion will be returned.
 * @param {number} discussionId - The id of the discussion to return.
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns a {Model} for the returned discussion.
 */
function getDiscussionById(communityId, discussionId, withRelated) {
   withRelated = withRelated || {}

   return dbGetOne(MAIN_MODEL, [
      ['community_id', '=', communityId],
      ['discussion_id', '=', discussionId]
   ], withRelated)

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No discussion found with the specified id'));
   });
}



module.exports = {

   /**
    * Returns a list of discussions from the database.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the discussions as a a collection of {Model}.
    */
   list(communityId, offset, limit) {
      return getList(communityId, offset, limit, {
         withRelated: ['postedByUser', 'category', 'comments']
      });
   },

   /**
    * Returns a discussion based on its id.
    * 
    * @param {number} communityId - The id of the community whose discussion.
    * @param {number} discussionId - The id of the discussion to return.
    *
    * @return {Promise} A promise that returns a {Model} for the returned discussion.
    */
   get(communityId, discussionId) {
      return getDiscussionById(communityId, discussionId, {
         withRelated: ['category', 'comments', 'postedByUser']
      });
   },

   /**
    * Returns a discussion's comments.
    * 
    * @param {number} communityId - The id of the community containing the discussion.
    * @param {number} discussionId - The id of the discussion whose comments will be returned.
    *
    * @return {Promise} A promise that returns a collection {Model} containing the comments.
    */
   comments(communityId, discussionId) {
      return new Promise(function(resolve, reject) {
         getDiscussionById(communityId, discussionId)
            .then(function(discussion) {
               return discussion.commentsSorted()
            })
            .then(function(comments) {
               return resolve(comments);
            }).catch(function(err) {
               return reject(err);
            });
      });
   },


   /**
    * Returns a list of recent discussions posted and comments to discussions.
    *
    * @param {number} communityId - The id of the community whose discussions activity will be returned.
    * @param {number} offset - (Optional) The first row (of the SELECT) to return.
    * @param {number} limit - (Optional) The number of rows to return.
    *
    * @return {array} An array of {object} - each of which represents a recently posted discussion or comment.
    */
   recentActivity(communityId, offset, limit) {

      offset = offset || 0;
      limit = limit || 10;

      return new Promise(function(resolve, reject) {

         //
         // Concurrently grab the list of recent posts and the list of recent comments.
         // Think of these 2 queries as running in parallel.
         //
         let promises = [
            //
            // Get the top posts
            //
            getList(communityId, offset, limit, {
               withRelated: ['postedByUser']
            }),
            //
            // Get the top comments to posts
            //
            new Community({
               community_id: communityId
            }).discussionCommentsSorted(offset, limit)
         ];

         Promise.all(promises).then(function(values) {

            //
            // Fill "recentActivity" with discussions and comments. Normalize the data and only include the fields
            // that the front-end cares about for the "recent activity" list view.
            //
            let recentActivity = values[0].map(function(discussion) {
               discussion = discussion.toJSON()
               return {
                  discussion_id: discussion.discussion_id,
                  title: discussion.title,
                  type: 'discussion',
                  creationDateTime: discussion.creation_date_time,
                  postedByUser: omit(discussion.postedByUser, 'password'),
                  debugDateTime: String(moment.utc(discussion.creation_date_time).toDate()),
                  momentDateTime: moment.utc(discussion.creation_date_time)
               }
            });
            recentActivity = recentActivity.concat(
               values[1].map(function(comment) {
                  comment = comment.toJSON()
                  return {
                     discussion_comment_id: comment.discussion_comment_id,
                     discussion_id: comment.discussion_id,
                     title: comment.body,
                     type: 'comment',
                     creationDateTime: comment.creation_date_time,
                     postedByUser: omit(comment.postedByUser, 'password'),
                     debugDateTime: String(moment.utc(comment.creation_date_time).toDate()),
                     momentDateTime: moment.utc(comment.creation_date_time)
                  }
               }));

            //
            // Sort by date. Most recent dates at the top.
            //
            recentActivity.sort(function(item1, item2) {
               let diff = item1.momentDateTime.diff(item2.momentDateTime)
               if (diff > 1) {
                  return -1;
               } else if (diff < 1) {
                  return 1;
               } else {
                  return 0;
               }
            });

            //
            // Remove the temp "momentDateTime" we added to each item and used for sorting.
            //
            recentActivity = recentActivity.map(item => {
               return omit(item, 'momentDateTime');
            });

            //
            // Constrain the list to the limit passed in.
            //
            recentActivity.length = Math.min(recentActivity.length, limit);

            return resolve(recentActivity);
         }).catch(function(err) {
            return reject(err);
         });
      });
   },

   /**
    * Returns a the community's discussion categories.
    * 
    * @param {number} communityId - The id of the community.
    *
    * @return {Promise} A promise that returns a collection {Model} containing the categories.
    */
   categories(communityId) {
      return DiscussionCategory.collection().query(function(q) {
         q.where('community_id', '=', communityId).orderBy("name", "asc")
      }).fetch();
   },

   /**
    * Creates a new discussion in the database.
    * 
    * @param {number} communityId - The id of the community.
    * @param {number} postedByUserId - The id of the user who created the discussion.
    * @param {string} title - The title of the post.
    * @param {string} body - The body of the post.
    * @param {number} discussionCategoryId - The database id of the row representing the category for the discussion.
    *
    * @return {Promise} A promise that returns a {Model} containing the newly created discussion (and its unique id).
    */
   createDiscussion(communityId, postedByUserId, title, body, discussionCategoryId) {
      return dbInsert({
         '_modelName': MAIN_MODEL,
         discussion_category_id: discussionCategoryId,
         title: title,
         body: body,
         posted_by_user_id: postedByUserId,
         community_id: communityId
      });
   },

   /**
    * Updates an existing discussion in the database.
    * 
    * @param {number} communityId - The id of the community.
    * @param {number} postedByUserId - The id of the user who created the discussion.
    * @param {number} discussionId - The id of the discussion to update.
    * @param {string} title - The title of the post.
    * @param {string} body - The body of the post.
    * @param {number} discussionCategoryId - The database id of the row representing the category for the discussion.
    *
    * @return {Promise} A promise that returns a {Model} containing the updated discussion.
    */
   updateDiscussion(communityId, postedByUserId, discussionId, title, body, discussionCategoryId) {
      return dbUpdate({
         '_modelName': MAIN_MODEL, // Model 
         discussion_id: discussionId, // Where...
         // Values to update...
         discussion_category_id: discussionCategoryId,
         title: title,
         body: body
      });
   },


   /**
    * Deletes an existing discussion (and its comments) from the database.
    * 
    * @param {number} discussionId - The id of the discussion to delete.
    *
    * @return {Promise} A promise with an empty success value if everything goes well.
    */
   deleteDiscussion(discussionId) {
      return dbTransaction(function(tx) {
         return dbGetOne(MAIN_MODEL, [
            ['discussion_id', '=', discussionId]
         ], {
            withRelated: ['comments']
         }, tx)

         //
         // First, delete the comments.
         //

         .then(function(discussion) {
            return discussion.related('comments').invokeThen('destroy')
         })

         //
         // Then, delete the discussion.
         //

         .then(function() {
            return dbDelete({
               '_modelName': MAIN_MODEL,
               discussion_id: discussionId
            }, tx)
         })
      });
   },

   /**
    * Creates a new discussion comment in the database.
    * 
    * @param {number} postedByUserId - The id of the user who created the comment.
    * @param {number} discussionId - The id of the discussion for which this is a comment.
    * @param {string} commentBody - The comment's text.
    *
    * @return {Promise} A promise that returns a {Model} containing the newly created discussion comment (and its unique id).
    */
   createDiscussionComment(postedByUserId, discussionId, commentBody) {
      return dbTransaction(function(tx) {
         let comment = null;

         //
         // First, create a comment.
         //

         return dbInsert({
            '_modelName': COMMENT_MODEL,
            discussion_id: discussionId,
            body: commentBody,
            posted_by_user_id: postedByUserId
         }, tx)

         //
         // Then get the discussion the comment is for...
         //

         .then(function(row) {
            comment = row;
            return dbGetOne(MAIN_MODEL, [
               ['discussion_id', '=', discussionId]
            ])
         })

         //
         // Then increment the comment_count of the discussion by one.
         //

         .then(function(discussion) {
               let commentCount = discussion.toJSON().comment_count + 1;
               return dbUpdate({
                  '_modelName': MAIN_MODEL,
                  discussion_id: discussionId,
                  comment_count: commentCount
               }, tx);
            })
            .then(function(updatedDiscussion) {
               return Promise.resolve(comment);
            })
      });
   },

   /**
    * Deletes an existing discussion comment from the database.
    * 
    * @param {number} discussionId - The id of the discussion that owns the comment.
    * @param {number} discussionCommentId - The id of the discussion comment to delete.
    *
    * @return {Promise} A promise with an empty success value if everything goes well.
    */
   deleteDiscussionComment(postedByUserId, discussionId, discussionCommentId) {
      return dbTransaction(function(tx) {

         //
         // First, delete the comment.
         //
         return dbDelete({
            '_modelName': COMMENT_MODEL,
            discussion_comment_id: discussionCommentId
         }, tx)

         //
         // Then, get the discussion whose comment was deleted.
         //

         .then(function() {
            return dbGetOne(MAIN_MODEL, [
               ['discussion_id', '=', discussionId]
            ])
         })

         //
         // Then decrement the comment_count of the discussion by one.
         //
         .then(function(discussion) {
            let commentCount = discussion.toJSON().comment_count - 1;
            return dbUpdate({
               '_modelName': MAIN_MODEL,
               discussion_id: discussionId,
               comment_count: commentCount
            }, tx);
         })
      });
   }
}