"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./calendar');
require('./calendar_event');


var CalendarMonth = db.Model.extend(
   {
      tableName: 'calendar_month',
      idAttribute: 'calendar_month_id', // Adding this made the binding not wrong

      calendar: function() {
         return this.belongsTo(db.model('Calendar'), 'calendar_id');
      },

// .query({where: {access: 'admin'}});
      calendarEvents:function() {
          return this.belongsToMany(
            db.model('CalendarEvent'), 'calendar_event_attendee', 'calendar_month_id', 'calendar_event_id');
      },

      calendarEventsWithCreators:function() {   
         return this.related("calendarEvents").query(function(q){}).fetch();
      },



   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);

module.exports = db.model('CalendarMonth', CalendarMonth);


