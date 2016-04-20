"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');
require('./page_post');
require('./sub_page');

let Page = db.Model.extend(
   {
      tableName: 'page',
      idAttribute: 'id', // Adding this made the binding not wrong

      community: function() {
         return this.belongsTo(db.model('Community'), 'community_id');
      },

      subPages: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('SubPage'), 'page_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      subPagesSorted:function(offset,limit) {
         offset = offset || 0;
         limit = limit || 10;
         return this.related("subPages").query(function(q){q.orderBy("id", "asc").offset(offset).limit(limit)}).fetch();
      },

      pagePosts: function() {
         //
         // Use db.model(name of model) to avoid cyclical import issues.
         // Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
         //
         return this.hasMany(db.model('PagePost'), 'page_id').through(db.model('SubPage'),'sub_page_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
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

module.exports = db.model('Page', Page);