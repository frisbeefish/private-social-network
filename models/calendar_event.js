"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./newdesign_calendar_event_attendee');
require('./user');


var CalendarEvent = db.Model.extend(
   {
      tableName: 'calendar_event',
      idAttribute: 'calendar_event_id', // Adding this made the binding not wrong

      creator:function() {
        return this.belongsTo(db.model('User'), 'creator_id');
      },

      attendees: function() {
         return this.hasMany(db.model('NewdesignCalendarEventAttendee'), 'calendar_event_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },



   },

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

module.exports = db.model('CalendarEvent', CalendarEvent);

