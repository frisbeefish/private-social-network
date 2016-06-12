/*****************************************************************************************
 *
 * File: db-adapter.js
 *
 * This module contains a JS layer that is used by the data services to communicate with the
 * Bookshelf ORM and its models. This layer is more declarative and much simpler than hand-coded Bookshelf
 * calls would look. This layer also leverages the transactional support provided by Bookshelf JS - so inserts, updates,
 * and deletes occur within 'all or nothing' db transactions.
 *
 **/


"use strict";

var Errors = require('../utils').Errors;

let _ = require('underscore');

var db = require('../models').db;


///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * This function adds calls to 'where' and 'andWhere' in a Bookshelf JS {Query} object based on
 * the passed-in array of where clauses. The end result is the "WHERE" part of a clause gets added 
 * into the {Query} object that Bookshelf will use to build a SQL query.
 *
 * @param {Query} q - Bookshelf JS query object that will be used by the Knex query builder to generate an SQL query.
 * @param {array} where - Array of where clause statements in this sort of form: ['user_id', '=', 5]
 */
function configureQueryWhereClause(q,where) {
   where.forEach((whereClause,idx) => {
      if (idx === 0) {
         q.where.apply(q,whereClause);
      } else {
         q.andWhere.apply(q,whereClause);
      }
   });    
}

/**
 * This function configures a Bookshelf JS {Query} object. Once the object has been configured, it can be used by
 * Bookshelf JS (and the Knex query builder) to build an SQL query that matches the values passed in to
 * this function.
 *
 * @param {Query} q - Bookshelf JS query object that will be used by the Knex query builder to generate an SQL query.
 * @param {array} where - Array of where clause statements in this sort of form: ['user_id', '=', 5]
 * @param {array} orderBy - Array of order clause statements in this sort of form: ['created_datetime', 'asc']
 * @param {number} offset - (Optional) If this has a value, it contains the OFFSET portion of a SELECT statement.
 * @param {number} limit - (Optional) If this has a value, it contains the LIMIT portion of a SELECT statement.
 */
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


module.exports = {

   /**
    * This function will wrap a callback within a Bookshelf JS database transaction.
    *
    * @param {function} callback - A callback containing database access code that will be invoked within a Bookshelf JS transaction.
    *
    * @return {Promise} A promise that was returned by the passed-in callback.
    */
    withTransaction(callback) {
       return db.withTransaction(function(tx) {
          return callback(tx)
       });
    },


   /**
     * This executes a SELECT statement against a database table. It might also contain JOINs/subqueries 
     * if the 'withRelated' value is not empty.
     *
     * @param {string} modelName - The name of the {Model} for the main table whose rows will be returned.
     * @param {array} where - (Optional) Array of where clause statements in this sort of form: ['user_id', '=', 5]
     * @param {array} orderBy - (Optional) Array of order clause statements in this sort of form: ['created_datetime', 'asc']
     * @param {object} withRelated - (Optional) This can be undefined, or {}, or contain values to pass into the Bookshelf JS 'fetch' function.
     * @param {number} offset - (Optional) If this has a value, it contains the OFFSET portion of a SELECT statement.
     * @param {number} limit - (Optional) If this has a value, it contains the LIMIT portion of a SELECT statement.
     *
     * @return {Promise} A promise that returns the rows as a a collection of {Model} objects.
     */
    list(modelName,where,orderBy,withRelated,offset,limit) {
        where = where || []
        orderBy = orderBy || []
        withRelated = withRelated || {}
        return db.model(modelName).collection().query(function(q) {configListQuery(q,where,orderBy,offset,limit)})
        .fetch(withRelated);
    },


   /**
     * This returns one row from a database table. It might also contain data obtained through JOINs/subqueries 
     * if the 'withRelated' value is not empty.
     *
     * @param {string} modelName - The name of the {Model} for the main table whose row will be returned.
     * @param {string} primaryKey - This is an object containing elements of a where clause that will return the desired row.
     * @param {object} withRelated - This can be undefined, or {}, or contain values to pass into the Bookshelf JS 'fetch' function.
     * @param {Transaction} tx - (Optional) A Bookshelf JS transaction.
     *
     * @return {Promise} A promise that returns the row as a {Model} object.
     */
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

   /**
     * This creates a new row in a database table. NOTE: The 'rowToInsert' object must contain a 'modelName' property
     * that will be used to specify which {Model} to use to INSERT the row.
     *
     * @param {object} rowToInsert - JavaScript object with columns and values (they must match column names in the
     *    database table). Must also contain a '_modelName' property containing the name of the model into which to
     *    INSERT a new row.
     * @param {Transaction} tx - (Optional) A Bookshelf JS transaction.
     *
     * @return {Promise} A promise that returns the new row as a {Model} object.
     */
    insert(rowToInsert,tx) {
        let model = tx ? tx.model(rowToInsert['_modelName']) : db.model(rowToInsert['_modelName']);
        let rowData = _(rowToInsert).omit('_modelName');
        return model.forge(
           _.extend(model.newRowDefaults(),rowData)
        ).save()
    },


   /**
     * This updates a row in a database table. NOTE: The 'rowToUpdate' object must contain a 'modelName' property
     * that will be used to specify which {Model} to use to UPDATE the row.
     *
     * @param {object} rowToUpdate - JavaScript object with columns and values (they must match column names in the
     *    database table). Must also contain a 'modelName' property containing the name of the model into which to
     *    UPDATE the row. It must also contain all the columns necessary to construct the primary key of the row. 
     * @param {Transaction} tx - (Optional) A Bookshelf JS transaction.
     *
     * @return {Promise} A promise that returns the updated row as a {Model} object.
     */
    update(rowToUpdate,tx) {
        let model = tx ? tx.model(rowToUpdate['_modelName']) : db.model(rowToUpdate['_modelName']);
        let rowData = _(rowToUpdate).omit('_modelName');
        let primaryKey = model.constructPrimaryKey(rowData);
        return model.forge(primaryKey)
        .fetch({require:true})
        .then(function(row) {
           return row.save(rowData);
        })
    },

   /**
     * This updates a row in a database table. NOTE: The 'rowToDelete' object must contain a 'modelName' property
     * that will be used to specify which {Model} to use to DELETE the row.
     *
     * @param {object} rowToDelete - JavaScript object must contain a 'modelName' property containing the name of the model into which to
     *    DELETE the row. It must also contain all the columns necessary to construct the primary key of the row.
     * @param {Transaction} tx - (Optional) A Bookshelf JS transaction.
     *
     * @return {Promise} A promise.
     */
    deleteRow(rowToDelete,tx) {
        let model = tx ? tx.model(rowToDelete['_modelName']) : db.model(rowToDelete['_modelName']);
        let primaryKey = model.constructPrimaryKey(rowToDelete);
        return model.forge(primaryKey)
        .fetch({require:true})
        .then(function(row) {
           return row.destroy();
        })
    }


}