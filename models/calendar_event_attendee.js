"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//


var CalendarEventAttendee = db.Model.extend(
   {
      tableName: 'calendar_event_attendee',
      idAttribute: 'calendar_appointment_attendee_id', // Adding this made the binding not wrong

   },

   {
      newRowDefaults: function() {
         return {
            invitation_response_status:''
         }
      }
   }
);

module.exports = db.model('CalendarEventAttendee', CalendarEventAttendee);

