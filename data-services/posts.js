"use strict";

const MAIN_MODEL = 'PostEntry';
const COMMENT_MODEL = 'PostEntryComment';

var moment = require('moment');
var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;

/*
var PostEntry = require('../models').PostEntry;
var Community = require('../models').Community;
*/

var Community = require('../models').Community;

var dbGetList = require('./db-adapter').list;
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
 * Returns a list of posts from the database.
 *
 * @param {number} communityId - The id of the community whose posts will be returned.
 * @param {number} offset - (Optional) the first row (of the SELECT) to return
 * @param {number} limit - (Optional) the number of rows to return
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns the posts as a a collection of {Model}.
 */
function getList(communityId,offset,limit,withRelated) {
   offset = offset || 0;
   limit = limit || 10;
   withRelated = withRelated || {}

   return dbGetList(
      MAIN_MODEL,                           // Model (the db table)
      [['community_id', '=', communityId]], // The where clause
      [["creation_date_time", "desc"]],     // The order by clause
      withRelated,                          // Load these relations as well...
      offset,limit
   );
}


/**
 * Returns a post based on its id.
 *
 * @param {number} communityId - The id of the community whose post will be returned.
 * @param {number} postEntryId - The id of the post to return.
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns a {Model} for the returned post.
 */
function getPostById(communityId,postEntryId,withRelated) {
   withRelated = withRelated || {}

   return dbGetOne(MAIN_MODEL,[['community_id','=',communityId],['post_entry_id','=',postEntryId]],withRelated)

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No post found with the specified id'));
   });
}


module.exports = {

   /**
    * Returns a list of posts from the database.
    *
    * @param {number} communityId - The id of the community whose discussions will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the posts as a a collection of {Model}.
    */
   list(communityId,offset,limit) {
      return getList(communityId,offset,limit,{withRelated:['postedByUser','comments','subPosts']});
   },

   /**
    * Returns a post based on its id.
    * 
    * @param {number} communityId - The id of the community whose discussion.
    * @param {number} postEntryId - The id of the post to return.
    *
    * @return {Promise} A promise that returns a {Model} for the returned post.
    */
   get(communityId,postEntryId) {
      return getPostById(communityId,postEntryId,{ withRelated : ['subPosts','comments','postedByUser']});
   },

   /**
    * Returns a post's comments.
    * 
    * @param {number} communityId - The id of the community containing the post.
    * @param {number} postEntryId - The id of the post whose comments will be returned.
    *
    * @return {Promise} A promise that returns a collection {Model} containing the comments.
    */
   comments(communityId,postEntryId) {
        return new Promise( function (resolve,reject) {
            getPostById(communityId,postEntryId)
            .then(function(postEntry) {
                return postEntry.commentsSorted()
            })
            .then(function(comments) {
                return resolve(comments);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

   /**
    * Returns a list of recent posts posted and comments to posts.
    *
    * @param {number} communityId - The id of the community whose posts activity will be returned.
    * @param {number} offset - (Optional) The first row (of the SELECT) to return.
    * @param {number} limit - (Optional) The number of rows to return.
    *  
    * @return {array} An array of {object} - each of which represents a recently posted post or comment.
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
            }).postCommentsSorted(offset, limit)
         ];

         Promise.all(promises).then(function(values) {

            //
            // Fill "recentActivity" with posts and comments. Normalize the data and only include the fields
            // that the front-end cares about for the "recent activity" list view.
            //
            let recentActivity = values[0].map(function(post) {
               post = post.toJSON()
               return {
                  post_entry_id: post.post_entry_id,
                  title: post.title,
                  type: 'post',
                  creationDateTime: post.creation_date_time,
                  postedByUser: omit(post.postedByUser, 'password'),
                  debugDateTime: String(moment.utc(post.creation_date_time).toDate()),
                  momentDateTime: moment.utc(post.creation_date_time)
               }
            });
            recentActivity = recentActivity.concat(
               values[1].map(function(comment) {
                  comment = comment.toJSON()
                  return {
                     post_entry_comment_id: comment.post_entry_comment_id,
                     post_entry_id: comment.post_entry_id,
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
    * Creates a new post in the database.
    * 
    * @param {number} communityId - The id of the community.
    * @param {number} postedByUserId - The id of the user who created the post.
    * @param {string} title - The title of the post.
    * @param {string} body - The body of the post.
    *
    * @return {Promise} A promise that returns a {Model} containing the newly created post (and its unique id).
    */
   createPost(communityId,postedByUserId,postType,title,body) {
      return dbInsert({ '_modelName':MAIN_MODEL,post_type:postType,
         title:title, body:body, posted_by_user_id:postedByUserId, community_id:communityId
      });
   },

   /**
    * Updates an existing post in the database.
    * 
    * @param {number} communityId - The id of the community.
    * @param {number} postedByUserId - The id of the user who created the post.
    * @param {number} postEntryId - The id of the post to update.
    * @param {string} title - The title of the post.
    * @param {string} body - The body of the post.
    *
    * @return {Promise} A promise that returns a {Model} containing the updated post.
    */
   updatePost(communityId,postedByUserId,postEntryId,title,body) {
      return dbUpdate({
         '_modelName':MAIN_MODEL,      // Model 
         post_entry_id:postEntryId, // Where...
         title:title,  body:body    // Values to update.
      });
   },


   /**
    * Deletes an existing post (and its comments) from the database.
    * 
    * @param {number} postEntryId - The id of the post to delete.
    *
    * @return {Promise} A promise with an empty success value if everything goes well.
    */
   deletePost(postEntryId) {
   return dbTransaction(function(tx) {
      return dbGetOne(MAIN_MODEL,[['post_entry_id','=',postEntryId]],{withRelated:['comments']},tx)

         //
         // First, delete the comments.
         //

         .then(function(discussion) {
            return discussion.related('comments').invokeThen('destroy')
         })

         //
         // Then, delete the post.
         //

         .then(function() {
            return dbDelete({ '_modelName':MAIN_MODEL,  post_entry_id:postEntryId },tx)
         })
      });
   },

   /**
    * Creates a new post comment in the database.
    * 
    * @param {number} postedByUserId - The id of the user who created the comment.
    * @param {number} discussionId - The id of the post for which this is a comment.
    * @param {string} commentBody - The comment's text.
    *
    * @return {Promise} A promise that returns a {Model} containing the newly created post comment (and its unique id).
    */
   createPostComment(postedByUserId,postEntryId,commentBody) {
      return dbTransaction(function(tx) {
         let comment = null;

         //
         // First, create a comment.
         //

         return dbInsert({ '_modelName':COMMENT_MODEL, post_entry_id:postEntryId, 
            body:commentBody, posted_by_user_id:postedByUserId
         },tx)

         //
         // Then get the post the comment is for...
         //

         .then(function(row) {
            comment = row;
            return dbGetOne(MAIN_MODEL,[['post_entry_id','=',postEntryId]])
         })

         //
         // Then increment the comment_count of the post by one.
         //

         .then(function(post) {
            let commentCount = post.toJSON().comment_count + 1;
            return dbUpdate({ '_modelName':MAIN_MODEL, post_entry_id:postEntryId, comment_count:commentCount },tx);
         })
         .then(function(updatedPost) {
            return Promise.resolve(comment);
         })
      });
   },

   /**
    * Deletes an existing post comment from the database.
    * 
    * @param {number} discussionId - The id of the post that owns the comment.
    * @param {number} discussionCommentId - The id of the post comment to delete.
    *
    * @return {Promise} A promise with an empty success value if everything goes well.
    */
   deletePostComment(postedByUserId,postEntryId,postEntryCommentId) {
      return dbTransaction(function(tx) {

         //
         // First, delete the comment.
         //
         return dbDelete({ '_modelName':COMMENT_MODEL,  post_entry_comment_id:postEntryCommentId },tx)

         //
         // Then, get the discussion whose comment was deleted.
         //

         .then(function() {
            return dbGetOne(MAIN_MODEL,[['post_entry_id','=',postEntryId]])
         })

         //
         // Then decrement the comment_count of the discussion by one.
         //
         .then(function(post) {
            let commentCount = post.toJSON().comment_count - 1;
            return dbUpdate({ '_modelName':MAIN_MODEL, post_entry_id:postEntryId, comment_count:commentCount },tx);
         })
      });
   }

}