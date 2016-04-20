"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');


var DiscussionCategory = db.Model.extend(
   {
      tableName: 'discussion_category',
      idAttribute: 'id',

      community: function() {
         return this.belongsTo(db.model('Community'));
      },

      discussions: function() {
         return this.belongsTo(db.model('Discussion'),'discussion_category_id');
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

module.exports = db.model('DiscussionCategory', DiscussionCategory);
