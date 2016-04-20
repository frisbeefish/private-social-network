"use strict";

var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;
var promisesSequence = require('./utils').promisesSequence;

var Discussion = require('../models').Discussion;


//
// Private methods.
//
function getDiscussionById(communityId,discussionId,withRelated) {

    withRelated = withRelated || {}

    return new Promise( function (resolve,reject) {
        Discussion.where({'community_id':communityId,'discussion_id':discussionId}).fetch(withRelated).then(function(discussion) {
            if (discussion) {
               return resolve(discussion);
            } else {
               return reject(new Errors.NotFoundError('No post found with the specified id'));
            }
        }).catch(function(err) {
            return reject(err);
        });
    });
}

//
// Public interface.
//
module.exports = {

    list(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Discussion.collection().query(function(q){q.where('community_id', '=', communityId).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch({withRelated:['postedByUser','category']}).then(function(discussions) {
                return resolve(discussions.toJSON());
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    get(communityId,discussionId) {
        return getDiscussionById(communityId,discussionId,{ withRelated : ['category','comments','postedByUser']});
    },

    comments(communityId,discussionId) {
        return new Promise( function (resolve,reject) {

            let sequence = promisesSequence([ 
                // 
                // First, get the post
                //
                _ => {return getDiscussionById(communityId,discussionId)},

                //
                // Then get its comments. (NOTE: "discussion" is passed in from the result of the prior promise)
                //
                (discussion) => { return discussion.commentsSorted()}
            ]);

            sequence.then(function(comments) {
                return resolve(comments);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

}