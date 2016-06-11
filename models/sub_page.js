"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./page');
require('./page_post');

let SubPage = db.Model.extend(

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      tableName: 'sub_page',
      idAttribute: 'id', // Adding this made the binding not wrong

      page: function() {
         return this.belongsTo(db.model('Page'), 'page_id');
      },

      pagePosts: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('PagePost'), 'sub_page_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      pagePostsSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         return this.related("pagePosts").query(function(q){q.orderBy("id", "asc").offset(offset).limit(limit)}).fetch();
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
module.exports = db.model('SubPage', SubPage);