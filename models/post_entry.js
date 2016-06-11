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

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
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
   
   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE PUBLIC STATIC METHODS AVAILABLE ON THIS MODEL.
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      newRowDefaults: function() {
         return {
            comment_count: 0,
            creation_date_time: new Date(),
            post_height: 0,
            thumbnail_url: "",
            original_content_url: ""
         }
      },
      constructPrimaryKey : function(rowData) {
          return {
              post_entry_id:rowData.post_entry_id
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
module.exports = db.model('PostEntry', PostEntry);


