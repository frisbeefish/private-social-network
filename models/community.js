"use strict";

let path = require('path');

let db = require('./db').db;

//let promisesSequence = require('../utils').Tools.promisesSequence;

let omit = require('../utils').Tools.omit;
let Errors = require('../utils').Errors;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./calendar');
require('./calendar_month');
require('./community_user');
require('./discussion');
require('./discussion_category');
require('./discussion_comment');
require('./page');
require('./post_entry');
require('./post_entry_comment');
require('./user');

//
// Private methods.
//
function getCommunityGroupUser(communityId) {
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
}

function getCalendar(calendar,groupUser) {
   return calendar.related("calendars").query(
       function(q){q.where('owner_id', '=', groupUser.user_id )}
       ).fetchOne();
} 

//=> { return self.related("calendars").query(function(q){q.where('owner_id', '=', groupUser.user_id )}).fetchOne())


let Community = db.Model.extend(


   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      tableName: 'community',
      idAttribute: 'community_id', // Adding this made the binding not wrong

      calendars: function() {
         return this.hasMany(db.model('Calendar'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      groupCalendar: function() {
         let communityId = this.get('community_id');
         let self = this;

         return new Promise( function (resolve,reject) {

             //return reject('hi scott');

             

             /*
             return this.related("calendars").query(function(q){q.where('owner_id', '=', calendarOwnerId )}).fetch();
             */

             getCommunityGroupUser(communityId)
             .then((groupUser) => getCalendar(self,groupUser))
             .then(function(calendar) {
                return resolve(calendar);
             }).catch(function(err) {
                return reject(err);
             });

             /*

              let sequence = promisesSequence([ 
                  // 
                  // First, get the group user
                  //
                  _ => {return getCommunityGroupUser(communityId)},

                  //
                  // Then get the calendar.
                  //
                  (groupUser) => { return self.related("calendars").query(function(q){q.where('owner_id', '=', groupUser.user_id )}).fetchOne()}
              ]);

              sequence.then(function(calendar) {
                  return resolve(calendar);
              }).catch(function(err) {
                  return reject(err);
              });
*/

          });

      },

      discussionCategories: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('DiscussionCategory'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      discussionCategoriesSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         //let communityId = this.get('community_id');
         return this.related("discussionCategories").query(function(q){q.orderBy("name", "asc").offset(offset).limit(limit)}).fetch();
      },

      posts: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('PostEntry'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      postsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         let communityId = this.get('community_id');
         return this.related("posts").query(function(q){q.where('community_id', '=', communityId ).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },

      postComments:function() {
          let communityId = this.get('community_id');
          return db.model('PostEntryComment').collection().query(function(q) {
             q.join('post_entry', 'post_entry.post_entry_id', '=', 'post_entry_comment.post_entry_id');
             q.where({'post_entry.community_id':communityId})
          })
      },

      postCommentsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         return this.related("postComments").query(function(q){q.orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch({withRelated:['postedByUser']});
      },


      discussions: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('Discussion'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      discussionsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         let communityId = this.get('community_id');
         return this.related("discussions").query(function(q){q.where('community_id', '=', communityId ).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },

      discussionComments:function() {
          let communityId = this.get('community_id');
          return db.model('DiscussionComment').collection().query(function(q) {
             q.join('discussion', 'discussion.discussion_id', '=', 'discussion_comment.discussion_id');
             q.where({'discussion.community_id':communityId})
          })
      },

      discussionCommentsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         
         return this.related("discussionComments").query(function(q){q.orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch({withRelated:['postedByUser']});
      },

      users: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         //return this.hasMany(db.model('User')).through(db.model('CommunityUser'),'community_id','community_user.user_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
         return this.belongsToMany(db.model('User')).through(db.model('CommunityUser'),'community_id','user_id');
      },

      usersSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 1000;
         let communityId = this.get('community_id');
         return this.related("users").query(function(q){q.where('community_id', '=', communityId ).orderBy("friendly_name", "desc").offset(offset).limit(limit)}).fetch();
      },

      adminsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         let communityId = this.get('community_id');
         return this.related("users").query(function(q){q.where('community_id', '=', communityId ).andWhere('community_user.is_admin', '=', 'Y').orderBy("friendly_name", "desc").offset(offset).limit(limit)}).fetch();
      },

      groupUser:function() {
         let communityId = this.get('community_id');
         return this.related("users").query(function(q){q.where('community_id', '=', communityId ).andWhere('user.is_group_user', '=', 'Y').limit(1)}).fetch();
      },


      pages: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('Page'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      pagesSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         //let communityId = this.get('community_id');
         return this.related("pages").query(function(q){q.orderBy("page_type_id", "asc").offset(offset).limit(limit)}).fetch();
      },


      /*

      targets: function () { this.hasMany(Target).through(Interim, throughForeignKey, otherKey); }

      posts: function() {
         return this.hasMany(PostEntry, 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      calendars: function() {
         return this.hasMany(Calendar, 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      sitePages: function() {
         return this.belongsToMany(lookupTableModels.SitePage, 'community_site_page', 'community_id', 'site_page_id');
       //return this.belongsToMany(lookupTableModels.SitePage).through(CommunitySitePage,"community_id"); //,"community_id");
       //return this.belongsToMany(lookupTableModels.SitePage).through(CommunitySitePage); //,"community_site_page"); //,"community_id");
      },
      */

/*
      members: function() {
         return this.belongsToMany(User, 'community_user', 'community_id', 'user_id');
      }
    */

   },

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE PUBLIC STATIC METHODS AVAILABLE ON THIS MODEL.
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {

   }
);

//
// This both registers the model with the Bookshelf JS "registry" and returns the model object. Once a model has been
// registered, it can be retrieved from the registry via a call to db.model(the_model_name). This is necessary in order to
// allow you to do more dynamic programming (where you only need the name of the model, not access to a model class/object).
// Also, you need to use this technique if you define your application's entire model in different files. If you didn't use
// this technique, you'd find that you got cyclic references between models and things wouldn't work! So break the cycles
// and add dynamic programming by embracing and using the Bookshelf JS "registry."
//
module.exports = db.model('Community', Community);




