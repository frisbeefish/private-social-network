
"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./post_entry');

var SubPostEntry = db.Model.extend(
   {
      tableName: 'sub_post_entry',
      idAttribute: 'sub_post_entry_id',

      postEntry: function() {
         return this.belongsTo(db.model('PostEntry')); 
      }
   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('SubPostEntry', SubPostEntry);

