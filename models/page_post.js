"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./sub_page');
require('./page_post_subelement');

let PagePost = db.Model.extend(
   {
      tableName: 'page_post',
      idAttribute: 'id', // Adding this made the binding not wrong

      subPage: function() {
         return this.belongsTo(db.model('SubPage'), 'sub_page_id');
      },
   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('PagePost', PagePost);