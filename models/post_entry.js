"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');
require('./post_entry_comment');
require('./sub_post_entry');
require('./user');


var PostEntry = db.Model.extend(
   {
      tableName: 'post_entry',
      idAttribute: 'post_entry_id',

      community: function() {
         return this.belongsTo(db.model('Community')); 
      },
      comments: function() {
         return this.hasMany(db.model('PostEntryComment'), 'post_entry_id'); 
      },

      commentsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
   
         return this.related("comments").query(function(q){q.orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },

      postedByUser: function() {
         return this.belongsTo(db.model('User'), 'posted_by_user_id'); 
      },
      subPosts: function() {
         return this.hasMany(db.model('SubPostEntry'), 'post_entry_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },
   },
   {
      newRowDefaults: function() {
         return {
            comment_count: 0,
            creation_date_time: new Date(),
            post_height: 0,
            thumbnail_url: "",
            original_content_url: ""
         }
      }
   }
);

module.exports = db.model('PostEntry', PostEntry);


