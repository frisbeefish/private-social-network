"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./calendar');
require('./community_user');
require('./discussion');
require('./discussion_category');
require('./page');
require('./post_entry');
require('./post_entry_comment');
require('./user');



let Community = db.Model.extend(
   {
      tableName: 'community',
      idAttribute: 'community_id', // Adding this made the binding not wrong

      calendars: function() {
         return this.hasMany(db.model('Calendar'), 'community_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      groupCalendar: function(calendarOwnerId) {
         let communityId = this.get('community_id');
         return this.related("calendars").query(function(q){q.where('owner_id', '=', calendarOwnerId )}).fetch();
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

          /*
          return new Promise( function (resolve,reject) {
              PostEntryComment.collection().query(function(q) {
                  q.join('post_entry', 'post_entry.post_entry_id', '=', 'post_entry_comment.post_entry_id');
                  q.where({'post_entry.community_id':communityId})
              }).fetch().then(function(comments) {
                  return resolve(comments); //.toJSON());
              }).catch(function(err) {
                  return reject(err);
              });
          });
*/
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
         limit = limit || 10;
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

});

module.exports = db.model('Community', Community);




