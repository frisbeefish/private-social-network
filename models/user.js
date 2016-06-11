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

var User = db.Model.extend(

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
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
   },

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE PUBLIC STATIC METHODS AVAILABLE ON THIS MODEL.
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      
   }


);

/*
var Users = db.Collection.extend({
  model: User
});
*/

//
// This both registers the model with the Bookshelf JS "registry" and returns the model object. Once a model has been
// registered, it can be retrieved from the registry via a call to db.model(the_model_name). This is necessary in order to
// allow you to do more dynamic programming (where you only need the name of the model, not access to a model class/object).
// Also, you need to use this technique if you define your application's entire model in different files. If you didn't use
// this technique, you'd find that you got cyclic references between models and things wouldn't work! So break the cycles
// and add dynamic programming by embracing and using the Bookshelf JS "registry."
//
module.exports = db.model('User', User);




