
/*****************************************************************************************
 *
 * DANGER!!!
 *
 * WORK IN PROGRESS.
 *
 * THIS CODE SHOULD BE TRANSITIONED TO USING "jsondb" SIMILAR TO HOW THESE ARE
 * CODED: communities.js, discussions.js, pages.js, posts.js, and users.js
 *
 **/


"use strict";

var _ = require('underscore');

var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;


////////////////////////////////////////////
//
// DANGER. REMOVE.  THESE ARE DEPRECATED!!!
//
////////////////////////////////////////////

var insert = require('./utils').insert;
var deleteWithoutRelated = require('./utils').deleteWithoutRelated;

var db = require('../models').db;
var Calendar = require('../models').Calendar;
var CalendarMonth = require('../models').CalendarMonth;
var CalendarEvent = require('../models').CalendarEvent;
var CalendarEventAttendee = require('../models').CalendarEventAttendee;
var Community = require('../models').Community;


///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////



/**
 * Delete a row from the database. THIS IS TEST CODE TO TRY TRANSACTIONS. REPLACE.
 *
 * @param {Transaction} trx - The Bookshelf JS transaction.
 * @param {string} modelName - The name of the model for the db row to delete.
 * @param {object} primaryKey - The primary key of the row to delete.
 *
 * @return {Promise} A promise that the row was deleted.
 */
function deleteRowWithinTransaction(trx, modelName, primaryKey) {
   return new Promise(function(resolve, reject) {
      trx.model(modelName).forge(primaryKey).fetch({
            require: true
         })
         .then(function(row) {
            row.destroy()
               .then(function(val) {
                  return resolve(val)
               })
               .catch(function(err) {
                  return reject(err);
               });
         })
         .catch(function(err) {
            return reject(err);
         });
   });
}


/**
 * Retrieves the calendar for a month. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
 *
 * @param {number} communityId - The community for which the calendar will be retrieved.
 * @param {number} month - The 1-based month of the calendar to retrieve.
 * @param {number} year - The year of the calendar to retrieve.
 * @param {boolean} withEvents - 'true' if the events should be retrieved along with the calendar.
 *
 * @return {Promise} A promise with the returned calendar.
 */
function getCalendarForMonth(communityId, month, year, withEvents) {
   let zeroBasedMonth = month - 1;
   return new Promise(function(resolve, reject) {

      Community.where('community_id', communityId).fetch()
         .then(function(community) {
            if (community) {
               community.groupCalendar()
                  .then(function(calendar) {

                     CalendarMonth.query(function(q) {
                           q.where('calendar_id', calendar.get('calendar_id'))
                              .andWhere('year', year)
                              .andWhere('month', zeroBasedMonth)
                        }).fetch()
                        .then(function(month) {
                           if (!withEvents) {
                              return resolve(month);
                           } else {
                              month.related('calendarEvents')
                                 .query(function(q) {
                                    q.orderBy('date', 'asc').orderBy('hour', 'asc').orderBy('minutes', 'asc')
                                 })
                                 .fetch({
                                    withRelated: ['creator']
                                 })
                                 .then(function(theEvents) {
                                    month = month.toJSON();
                                    month.calendarEvents = theEvents.toJSON();
                                    return resolve(month);
                                 })
                                 .catch(function(err) {
                                    return reject(err);
                                 });
                           }
                        })
                        .catch(function(err) {
                           return reject(err);
                        });
                  })
                  .catch(function(err) {
                     return reject(err);
                  });
            } else {
               return reject(new Errors.NotFoundError('No community found with the specified id'));
            }
         })
         .catch(function(err) {
            return reject(err);
         });
   });
}



module.exports = {

   /**
    * Returns the group calendar for a specified community.
    *
    * @param {number} communityId - The id of the community whose calendar will be returned.
    *
    * @return {Promise} A promise that returns the community's group calendar as a {Model}.
    */
   get(communityId) {
      return new Promise(function(resolve, reject) {
         Community.where('community_id', communityId).fetch().then(function(community) {
            if (community) {
               community.groupCalendar().then(function(calendar) {
                  return resolve(calendar);
               }).catch(function(err) {
                  return reject(err);
               })
            } else {
               return reject(new Errors.NotFoundError('No community found with the specified id'));
            }
         }).catch(function(err) {
            return reject(err);
         });
      });
   },


   /**
    * Retrieves the calendar and events for a month. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
    *
    * @param {number} communityId - The community for which the calendar will be retrieved.
    * @param {number} month - The 1-based month of the calendar to retrieve.
    * @param {number} year - The year of the calendar to retrieve.
    * @param {boolean} withEvents - 'true' if the events should be retrieved along with the calendar.
    *
    * @return {Promise} A promise with the returned calendar and events.
    */
   getCalendarForMonth(communityId, month, year) {
      return getCalendarForMonth(communityId, month, year, true);
   },


   /**
    * Retrieves the calendar events for a day. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
    *
    * @param {number} communityId - The community for which the calendar will be retrieved.
    * @param {number} dayInMonth - The "date" of the day within the month. Valid values are 1-31 (depending on the month).
    * @param {number} month - The 1-based month of the calendar to retrieve.
    * @param {number} year - The year of the calendar to retrieve.
    * @param {boolean} withEvents - 'true' if the events should be retrieved along with the calendar.
    *
    * @return {Promise} A promise with the returned calendar events.
    */
   getCalendarForDay(communityId, dateInMonth, month, year) {
      let zeroBasedMonth = month - 1;
      return new Promise(function(resolve, reject) {
         Community.where('community_id', communityId).fetch().then(function(community) {
            if (community) {
               community.groupCalendar().then(function(calendar) {
                  CalendarMonth.query(function(q) {
                        q.where('calendar_id', calendar.get('calendar_id'))
                           .andWhere('year', year)
                           .andWhere('month', zeroBasedMonth)
                     })
                     .fetch({
                        withRelated: //['calendarEvents']
                           [{
                           'calendarEvents': function(qb) {
                              qb.where('date', dateInMonth).orderBy('date', 'asc').orderBy('hour', 'asc').orderBy('minutes', 'asc');
                           }
                        }]

                     }).then(function(month) {
                        return resolve(month);
                     }).catch(function(err) {
                        return reject(err);
                     })

                  //return resolve(calendar);
               }).catch(function(err) {
                  return reject(err);
               })
            } else {
               return reject(new Errors.NotFoundError('No community found with the specified id'));
            }
         }).catch(function(err) {
            return reject(err);
         });
      });
   },


   /**
    * Creates a new calendar event. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
    *
    * @param {number} communityId - The community for which the calendar event will be created.
    * @param {number} eventCreatedByUserId - The database user id of the user creating the event.
    * @param {number} dayInMonth - The "date" of the day within the month. Valid values are 1-31 (depending on the month).
    * @param {number} month - The 1-based month of the calendar to retrieve.
    * @param {number} year - The year of the calendar to retrieve.
    * @param {object} eventData - The attributes of the event.
    *
    * @return {Promise} A promise with the newly created calendar event as a {Model}.
    */
   createCalendarEvent(communityId, eventCreatedByUserId, dateInMonth, month, year, eventData) {
      return new Promise(function(resolve, reject) {
         let calendarMonth = null;
         getCalendarForMonth(communityId, month, year)
            .then(function(month) {
               calendarMonth = month;
               return CalendarEvent.forge(
                  _.extend(CalendarEvent.newRowDefaults(), {
                     day_of_week: 1,
                     date: dateInMonth,
                     hour: 2,
                     minutes: 0,
                     duration_minutes: 30,
                     event_name: 'some title',
                     description: 'some body',
                     creation_date_time: new Date(),
                     creator_id: eventCreatedByUserId,
                     recurs_this_many: 0,
                     max_attendees: 0,
                     event_image_url: '',
                  })
               ).save()
            })
            .then(function(calendarEvent) {
               CalendarEventAttendee.forge(
                     _.extend(CalendarEventAttendee.newRowDefaults(), {
                        calendar_event_id: calendarEvent.get('calendar_event_id'),
                        calendar_month_id: calendarMonth.get('calendar_month_id')
                     })
                  ).save()
                  .then(function(calendarEventAttendee) {
                     return resolve(calendarEvent);
                  })
                  .catch(function(err) {
                     return reject(err);
                  });
            })
            .catch(function(err) {
               return reject(err);
            });
      });
   },


   /**
    * Updates an existing calendar event. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
    *
    * @param {number} communityId - The community for which the calendar event will be updated.
    * @param {number} creatorId - The database user id of the user updating the event.
    * @param {number} calendarEventId - The database id of the event to update.
    * @param {object} eventData - The attributes of the event.
    *
    * @return {Promise} A promise with the updated calendar event as a {Model}.
    */
   updateCalendarEvent(communityId, creatorId, calendarEventId, eventData) {
      return new Promise(function(resolve, reject) {
         db.transaction(function(t) {
               return CalendarEvent.where({
                     'calendar_event_id': calendarEventId
                  }).fetch({
                     require: true
                  })
                  .then(function(calendarEvent) {
                     return calendarEvent.save({
                        event_name: 'CHANGED'
                     }, {
                        transacting: t
                     })
                  });
            })
            .then(function(calendarEvent) {
               return resolve(calendarEvent);
            }).catch(function(err) {
               return reject(err);
            });
      });
   },


   /**
    * Deletes a calendar event. REPLACE THIS DURING REWRITE WITH "jsondb.js" LIB.
    *
    * @param {number} communityId - The community for which the calendar event will be deleted.
    * @param {number} creatorId - The database user id of the user deleting the event.
    * @param {number} calendarEventId - The database id of the event to delete.
    *
    * @return {Promise} A promise (which will raise an exception of an error occurred).
    */
   deleteCalendarEvent(communityId, creatorId, calendarEventId) {
      return new Promise(function(resolve, reject) {
         db.transaction(function(t) {
               return CalendarEventAttendee.where({
                     'calendar_event_id': calendarEventId
                  }).fetch({
                     require: true
                  })
                  .then(function(CalendarEventAttendee) {
                     return CalendarEventAttendee.destroy({
                           transacting: t
                        })
                        .then(function() {
                           return CalendarEvent.where({
                                 'calendar_event_id': calendarEventId
                              }).fetch({
                                 require: true
                              })
                              .then(function(calendarEvent) {
                                 return calendarEvent.destroy({
                                    transacting: t
                                 })

                              });
                        })
                  });
            })
            .then(function(library) {
               return resolve(true);
            }).catch(function(err) {
               return reject(err);
            });
      });
   }

}