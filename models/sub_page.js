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
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('SubPage', SubPage);