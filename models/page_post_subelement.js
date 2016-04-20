"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./page_post');

let PagePostSubelement = db.Model.extend(
   {
      tableName: 'page_post_subelement',
      idAttribute: 'id', // Adding this made the binding not wrong

      pagePost: function() {
         return this.belongsTo(db.model('PagePost'), 'page_post_id');
      },
   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('PagePostSubelement', PagePostSubelement);