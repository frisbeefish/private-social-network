
"use strict";

var User = require('../models').User;

var Errors = require('../utils').Errors;

/*
discussionsInCommunity:function(community_id,offset,limit) {
         offset = offset || 0;
         limit = limit || 10;

         .query(function(q){q.where('community_id', '=', community_id).orderBy("creation_date_time", "desc").offset(offset).limit(limit)})

*/

module.exports = {

    list(offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            User.collection().query(function(q){q.orderBy("friendly_name", "asc").offset(offset).limit(limit)}).fetch().then(function(collection) {
                var coll = collection.toJSON()
                var response = [];
                response = coll.map((user) => {
                    return {
                        user_id: user['user_id'],
                        friendly_name: user['friendly_name'],
                        first_name: user['first_name'],
                        last_name: user['last_name']
                    }
                });
                return resolve(response);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    get(userId) {
        return new Promise( function (resolve,reject) {
            User.where('user_id', userId).fetch().then(function(user) {
                if (user) {
                    user = user.toJSON();
                    delete user.password;
                    return resolve(user);
                } else {
                   return reject(new Errors.NotFoundError('No user found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    discussions(userId,communityId,offset,limit) {
       offset = offset || 0;
       limit = limit || 10;
       return new Promise( function (resolve,reject) {
            User.where('user_id', userId).fetch().then(function(user) {
                if (user) {
                    user.discussionsInCommunity(communityId,offset,limit).then(function(discussions) {
                        return resolve(discussions);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                   return reject(new Errors.NotFoundError('No user found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    messages(userId,communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            User.where('user_id', userId).fetch().then(function(user) {
                if (user) {
                    user.messagesInCommunity(communityId,offset,limit).then(function(messages) {
                        return resolve(messages);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                   return reject(new Errors.NotFoundError('No user found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    posts(userId,communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            User.where('user_id', userId).fetch().then(function(user) {
                if (user) {
                    user.postsInCommunity(communityId,offset,limit).then(function(discussions) {
                        return resolve(discussions);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                   return reject(new Errors.NotFoundError('No user found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },


}