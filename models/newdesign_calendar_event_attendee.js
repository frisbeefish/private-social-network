
"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./user');


var NewdesignCalendarEventAttendee = db.Model.extend(
   {
      tableName: 'newdesign_calendar_event_attendee',
      idAttribute: 'id', // Adding this made the binding not wrong

      attendee:function() {
        return this.belongsTo(db.model('User'), 'user_id');
      },

/*
      calendar: function() {
         return this.belongsTo(Calendar, 'calendar_id');
      },

      calendarEvents:function() {
          return this.belongsToMany(CalendarEvent, 'calendar_event_attendee', 'calendar_month_id', 'calendar_event_id');
      },
*/
   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('NewdesignCalendarEventAttendee', NewdesignCalendarEventAttendee);


