"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./calendar_month');
require('./user');

let Calendar = db.Model.extend(
   {
      tableName: 'calendar',
      idAttribute: 'calendar_id', // Adding this made the binding not wrong

      owner: function() {
         return this.belongsTo(db.model('User'), 'owner_id');
      },

      months: function() {
         return this.hasMany(db.model('CalendarMonth'), 'calendar_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('Calendar', Calendar);