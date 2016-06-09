/*****************************************************************************************
 *
 * File: data
 *
 **/


"use strict";

var Errors = require('../utils').Errors;

let _ = require('underscore');

var db = require('../models').db;

function configureQueryWhereClause(q,where) {
   where.forEach((whereClause,idx) => {
      if (idx === 0) {
         q.where.apply(q,whereClause);
      } else {
         q.andWhere.apply(q,whereClause);
      }
   });    
}

function configListQuery(q,where,orderBy,offset,limit) {
   configureQueryWhereClause(q,where);
   orderBy.forEach((orderByClause) => {
      q.orderBy.apply(q,orderByClause);
   });
   if (offset) {
      q.offset(offset);
   }
   if (limit) {
      q.limit(limit);
   }
   return q;
}

/*
        Discussion.where({'community_id':communityId,'discussion_id':discussionId}).fetch(withRelated).then(function(discussion) {

configureQueryWhereClause(q,where);

*/

/*

        db.withTransaction(function(trx) {

            deleteRowWithinTransaction(trx,'CalendarEventAttendee',{calendar_event_id:calendarEventId}) 
            //.then(function(parm) {
            //    console.error('DONE WITH DELETE CALENDAR EVENT ATTENDEE');
            //    return deleteRowWithinTransaction(trx,'CalendarEvent',{calendar_event_id:calendarEventId}) 
            //})
            .then(function(parm) {
                console.error('DONE WITH EVERYTHING?');
                resolve(true);
            })
            .catch(function(err) {
               return reject(err);
            });

function deleteRowWithinTransaction(trx,modelName,primaryKey) {
   console.log('DELETTING ROW OF MODEL: ' + modelName + " with primary key: " + JSON.stringify(primaryKey));
   return new Promise( function (resolve,reject) {
      trx.model(modelName).forge(primaryKey).fetch({require:true})
      .then(function(row) {
         row.destroy()
         .then(function(val) {
            console.error('DID DESTROY?')
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

var devID = Developer.forge({key: key})
      .fetch({require: true, transacting: t})
      .call("get", "id");

    var addressID = devID.then(function() {
      return Address.forge(user.address).fetch({require: true, transacting: t})
    }).call("get", "addressId");

    var financialID = addressModel.then(function() {
      return Financial.forge(user.financial).save(null, {transacting: t})
    }).call("get", "financialId");

*/

module.exports = {

    /*
    db.withTransaction(function(trx) {
    */

    withTransaction(callback) {
       return db.withTransaction(function(tx) {
          return callback(tx)
       });
    },

    list(modelName,where,orderBy,withRelated,offset,limit) {
        return db.model(modelName).collection().query(function(q) {configListQuery(q,where,orderBy,offset,limit)})
        .fetch(withRelated);
    },


    get(modelName,primaryKey,withRelated,tx) {
        withRelated = withRelated || {};
        let model = tx ? tx.model(modelName) : db.model(modelName);
        withRelated.require = true;
        if (tx) {
           withRelated.transacting = tx;
        }
        return model.query(function(q) {configureQueryWhereClause(q,primaryKey)} )
        .fetch(withRelated);
    },

    insert(rowToInsert,tx) {
        let model = tx ? tx.model(rowToInsert.modelName) : db.model(rowToInsert.modelName);
        let rowData = _(rowToInsert).omit('modelName');
        console.error('IN INSERT ABOUT TO SAVE');
        return model.forge(
           _.extend(model.newRowDefaults(),rowData)
        ).save()
        //.catch(function(err) {
        //    console.error('ERROR!!!: ' + err);
        //})
    },

    update(rowToUpdate,tx) {
        let model = tx ? tx.model(rowToUpdate.modelName) : db.model(rowToUpdate.modelName);
        let rowData = _(rowToUpdate).omit('modelName');
        let primaryKey = model.constructPrimaryKey(rowData);
        //console.error('PRIMARY KEY: ' + JSON.stringify(primaryKey));
        return model.forge(primaryKey)
        .fetch({require:true})
        .then(function(row) {
           return row.save(rowData);
        })
    },

    deleteRow(rowToDelete,tx) {
        let model = tx ? tx.model(rowToDelete.modelName) : db.model(rowToDelete.modelName);
        let primaryKey = model.constructPrimaryKey(rowToDelete);
        return model.forge(primaryKey)
        .fetch({require:true})
        .then(function(row) {
           return row.destroy();
        })
    }


}