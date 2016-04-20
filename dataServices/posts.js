"use strict";

var moment = require('moment');
var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;
var promisesSequence = require('./utils').promisesSequence;

var PostEntry = require('../models').PostEntry;
var Community = require('../models').Community;


function getList(communityId,offset,limit,withRelated) {
    offset = offset || 0;
    limit = limit || 10;
    withRelated = withRelated || {}

    return new Promise( function (resolve,reject) {
        PostEntry.collection().query(function(q){q.where('community_id', '=', communityId).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch(withRelated).then(function(posts) {
            return resolve(posts); //.toJSON());
        }).catch(function(err) {
            return reject(err);
        });
    });
}


//
// Private methods.
//
function getPostById(communityId,postEntryId,withRelated) {

    withRelated = withRelated || {}

    return new Promise( function (resolve,reject) {
        PostEntry.where({'community_id':communityId,'post_entry_id':postEntryId}).fetch(withRelated).then(function(post) {
            if (post) {
               return resolve(post);
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
        console.log('DATE: ' + moment.utc('2014-09-30T23:05:12.000Z').toDate());
        return getList(communityId,offset,limit,{withRelated:['postedByUser','subPosts']});
    },

    get(communityId,postEntryId) {
        return getPostById(communityId,postEntryId,{ withRelated : ['subPosts','comments','postedByUser']});
    },

    comments(communityId,postEntryId) {
        return new Promise( function (resolve,reject) {

            let sequence = promisesSequence([ 
                // 
                // First, get the post
                //
                _ => {return getPostById(communityId,postEntryId)},

                //
                // Then get its comments. (NOTE: "postEntry" is passed in from the result of the prior promise)
                //
                (postEntry) => { return postEntry.commentsSorted()}
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
            //
            let promises = [
               //
               // Get the top posts
               //
               getList(communityId,offset,limit,{withRelated:['postedByUser']}),
               //
               // Get the top comments to posts
               //
               new Community({community_id:communityId}).postCommentsSorted(offset,limit)
            ];
            Promise.all(promises).then(function(values) { 
                //let recentActivity = [{foo:'bar'}];
                let recentActivity = values[0].map(function(post) {
                    post = post.toJSON()
                    return {
                        post_entry_id:post.post_entry_id,
                        title:post.title,
                        type:'post',
                        creationDateTime:post.creation_date_time,
                        postedByUser:omit(post.postedByUser,'password')
                    }
                });
                recentActivity = recentActivity.concat(
                    values[1].map(function(comment) {
                    comment = comment.toJSON()
                    return {
                        post_entry_comment_id:comment.post_entry_comment_id,
                        post_entry_id:comment.post_entry_id,
                        title:comment.body,
                        type:'comment',
                        creationDateTime:comment.creation_date_time,
                        postedByUser:omit(comment.postedByUser,'password')
                    }
                }));
                return resolve(recentActivity);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },
}