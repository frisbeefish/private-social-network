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

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
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
   
   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE PUBLIC STATIC METHODS AVAILABLE ON THIS MODEL.
   //
   ///////////////////////////////////////////////////////////////////////////////////
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

//
// This both registers the model with the Bookshelf JS "registry" and returns the model object. Once a model has been
// registered, it can be retrieved from the registry via a call to db.model(the_model_name). This is necessary in order to
// allow you to do more dynamic programming (where you only need the name of the model, not access to a model class/object).
// Also, you need to use this technique if you define your application's entire model in different files. If you didn't use
// this technique, you'd find that you got cyclic references between models and things wouldn't work! So break the cycles
// and add dynamic programming by embracing and using the Bookshelf JS "registry."
//
module.exports = db.model('PostEntryComment', PostEntryComment);
