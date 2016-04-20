
"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./discussion');
require('./user');


var DiscussionComment = db.Model.extend(
   {
      tableName: 'discussion_comment',
      idAttribute: 'discussion_comment_id',

      discussion: function() {
         return this.belongsTo(db.model('Discussion'));
      },

      postedByUser: function() {
         return this.belongsTo(db.model('User'), 'posted_by_user_id'); 
      },

   }, 
   {
      newRowDefaults: function() {
         return {
            creation_date_time: new Date(),
            discussion_comment_height:0
         }
      }
   }
);

module.exports = db.model('DiscussionComment', DiscussionComment);
