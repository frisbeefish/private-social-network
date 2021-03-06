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

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
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
module.exports = db.model('Calendar', Calendar);