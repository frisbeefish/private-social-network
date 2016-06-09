"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./post_entry');
require('./user');

var PostEntryComment = db.Model.extend(
   {
      tableName: 'post_entry_comment',
      idAttribute: 'post_entry_comment_id',

      post: function() {
         return this.belongsTo(db.model('PostEntry'));
      },

      postedByUser: function() {
         return this.belongsTo(db.model('User'), 'posted_by_user_id'); 
      },

   }, 
   {
      newRowDefaults: function() {
         return {
            creation_date_time: new Date()
         }
      },
      constructPrimaryKey : function(rowData) {
          return {
              post_entry_comment_id:rowData.post_entry_comment_id
          }
      }
   }
);

module.exports = db.model('PostEntryComment', PostEntryComment);
