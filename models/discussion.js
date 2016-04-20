
"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');
require('./discussion_category');
require('./discussion_comment');
require('./user');

var Discussion = db.Model.extend(
   {
      tableName: 'discussion',
      idAttribute: 'discussion_id',
      community: function() {
         return this.belongsTo(db.model('Community')); 
      },
      comments: function() {
         return this.hasMany(db.model('DiscussionComment'), 'discussion_id'); 
      },

      commentsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;

         return this.related("comments").query(function(q){q.orderBy("creation_date_time", "desc").offset(offset).limit(limit)}).fetch();
      },

      postedByUser: function() {
         return this.belongsTo(db.model('User'), 'posted_by_user_id'); 
      },

      category: function() {
         return this.belongsTo(db.model('DiscussionCategory'), 'discussion_category_id'); 
      },

   },
   {
      newRowDefaults: function() {
         return {
            post_type:"0",
            comment_count: 0,
            creation_date_time: new Date(),
            discussion_height: 0
         }
      }
   }
);

module.exports = db.model('Discussion', Discussion);