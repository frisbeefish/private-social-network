"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./calendar_event_attendee');
require('./newdesign_calendar_event_attendee');
require('./user');


var CalendarEvent = db.Model.extend(
   
   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      tableName: 'calendar_event',
      idAttribute: 'calendar_event_id', // Adding this made the binding not wrong

      creator:function() {
        return this.belongsTo(db.model('User'), 'creator_id');
      },

      creatorLink: function() {
         return this.hasMany(db.model('CalendarEventAttendee'), 'calendar_event_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      attendees: function() {
         return this.hasMany(db.model('NewdesignCalendarEventAttendee'), 'calendar_event_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
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
            is_appointment:"N",
            appointment_type:1, // One-time event
            recurs_type:0,
            creation_date_time:new Date(),
            last_update_date_time:new Date(),
            visibility_level:0,
            event_image_url:"",
            recurs_this_many:0,
            max_attendees:0
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
module.exports = db.model('CalendarEvent', CalendarEvent);

