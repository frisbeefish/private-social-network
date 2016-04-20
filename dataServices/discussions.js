"use strict";

var moment = require('moment');
var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;
var promisesSequence = require('./utils').promisesSequence;

var Community = require('../models').Community;
var Discussion = require('../models').Discussion;


//
// Private methods.
//

function getList(communityId,offset,limit,withRelated) {
    offset = offset || 0;
    limit = limit || 10;
    withRelated = withRelated || {}

    return new Promise( function (resolve,reject) {
        Discussion.collection().query(function(q){q.where('community_id', '=', communityId).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch(withRelated).then(function(discussions) {
            return resolve(discussions); //.toJSON());
        }).catch(function(err) {
            return reject(err);
        });
    });
}


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
        return getList(communityId,offset,limit,{withRelated:['postedByUser','category']});
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


    recentActivity(communityId,offset,limit) {

        offset = offset || 0;
        limit = limit || 10;

        return new Promise( function (resolve,reject) {

            //
            // Concurrently grab the list of recent posts and the list of recent comments.
            // Think of these 2 queries as running in parallel.
            //
            let promises = [
               //
               // Get the top posts
               //
               getList(communityId,offset,limit,{withRelated:['postedByUser']}),
               //
               // Get the top comments to posts
               //
               new Community({community_id:communityId}).discussionCommentsSorted(offset,limit)
            ];

            Promise.all(promises).then(function(values) { 

                //
                // Fill "recentActivity" with discussions and comments. Normalize the data and only include the fields
                // that the front-end cares about for the "recent activity" list view.
                //
                let recentActivity = values[0].map(function(discussion) {
                    discussion = discussion.toJSON()
                    return {
                        discussion_id:discussion.discussion_id,
                        title:discussion.title,
                        type:'discussion',
                        creationDateTime:discussion.creation_date_time,
                        postedByUser:omit(discussion.postedByUser,'password'),
                        debugDateTime:String(moment.utc(discussion.creation_date_time).toDate()),
                        momentDateTime:moment.utc(discussion.creation_date_time)
                    }
                });
                recentActivity = recentActivity.concat(
                    values[1].map(function(comment) {
                    comment = comment.toJSON()
                    return {
                        discussion_comment_id:comment.discussion_comment_id,
                        discussion_id:comment.discussion_id,
                        title:comment.body,
                        type:'comment',
                        creationDateTime:comment.creation_date_time,
                        postedByUser:omit(comment.postedByUser,'password'),
                        debugDateTime:String(moment.utc(comment.creation_date_time).toDate()),
                        momentDateTime:moment.utc(comment.creation_date_time)
                    }
                }));

                //
                // Sort by date. Most recent dates at the top.
                //
                recentActivity.sort(function(item1,item2) {
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
                    return omit(item,'momentDateTime');
                });

                //
                // Constrain the list to the limit passed in.
                //
                recentActivity.length = Math.min(recentActivity.length,limit);
                
                return resolve(recentActivity);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },


}