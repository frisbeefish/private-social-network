"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');
require('./discussion');
require('./post_entry');
require('./site_page');
require('./website_message');

var User = db.Model.extend({
      tableName: 'user',
      idAttribute: 'user_id',

      communities: function() {
         return this.belongsToMany(db.model('SitePage'), 'community_user', 'user_id', 'community_id' );
      },

      discussions: function() {
         return this.hasMany(db.model('Discussion'), 'posted_by_user_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      discussionsInCommunity:function(community_id,offset,limit) {
         offset = offset || 0;
         limit = limit || 10;

         return this.related("discussions").query(function(q){q.where('community_id', '=', community_id).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },


      messages: function() {
         return this.hasMany(db.model('WebsiteMessage'), 'recipient_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      messagesInCommunity:function(community_id,offset,limit) {
         offset = offset || 0;
         limit = limit || 10;

         return this.related("messages").query(function(q){q.where('community_id', '=', community_id).orderBy("sent_datetime", "desc").offset(offset).limit(limit)}).fetch();
      },

      posts: function() {
         return this.hasMany(db.model('PostEntry'), 'posted_by_user_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      postsInCommunity:function(community_id,offset,limit) {
         offset = offset || 0;
         limit = limit || 10;

         return this.related("posts").query(function(q){q.where('community_id', '=', community_id).orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },


});

/*
var Users = db.Collection.extend({
  model: User
});
*/

module.exports = db.model('User', User);




