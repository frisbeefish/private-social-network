"use strict";

var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;

var Community = require('../models').Community;

module.exports = {

    list(offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.collection().query(function(q){q.orderBy("network_name", "asc").offset(offset).limit(limit)}).fetch().then(function(communities) {
                return resolve(communities.toJSON());
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    get(communityId) {
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                   return resolve(community.toJSON());
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }
              
            }).catch(function(err) {
               return reject(err);
            });
        });
    },

/*
    CommunitiesDS.groupUser(communityId).then(function(users) {
        res.json(users);
    }).catch( err => next(err));

*/

    calendar(communityId) {
        
        //console.log('IN CALENDAR, this.groupUser: ' + this.groupUser);

        let getGroupUser = this.groupUser;

        return new Promise( function (resolve,reject) {
            getGroupUser(communityId).then(function(user) {
                Community.where('community_id', communityId).fetch().then(function(community) {
                    if (community) {
                        community.groupCalendar(user.user_id).then(function(calendars) {
                            return resolve(calendars);
                        }).catch(function(err) {
                            return reject(err);
                        })
                    } else {
                       return reject(new Errors.NotFoundError('No community found with the specified id'));
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            }).catch( err => reject(err));
        });
    },

    discussionCategories(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.discussionCategoriesSorted(offset,limit).then(function(discussionCategories) {
                        return resolve(discussionCategories);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    discussions(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.discussionsSorted(offset,limit).then(function(discussions) {
                        return resolve(discussions);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },


    pages(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.pagesSorted(offset,limit).then(function(pages) {
                        return resolve(pages);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },



    posts(communityId,offset,limit) {
        console.log('IN POSTS DS, offset: ' + offset);
        console.log('limit: ' + limit);
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.postsSorted(offset,limit).then(function(posts) {
                        return resolve(posts);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    users(communityId,offset,limit) {
        console.log('IN POSTS DS, offset: ' + offset);
        console.log('limit: ' + limit);
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.usersSorted(offset,limit).then(function(users) {
                        users = users.toJSON().map((user) => {
                            user = omit(user,'password');
                            return user;
                        });
                        return resolve(users);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    admins(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.adminsSorted(offset,limit).then(function(users) {
                        users = users.toJSON().map((user) => {
                            user = omit(user,'password');
                            return user;
                        });
                        return resolve(users);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    groupUser(communityId) {
        return new Promise( function (resolve,reject) {
            Community.where('community_id', communityId).fetch().then(function(community) {
                if (community) {
                    community.groupUser().then(function(users) {
                        let user = users.toJSON()[0];
                        user = omit(user,'password');
                        return resolve(user);
                    }).catch(function(err) {
                        return reject(err);
                    })
                } else {
                   return reject(new Errors.NotFoundError('No community found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

}


