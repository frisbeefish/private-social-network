
"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./website_message_recipient');
require('./user');



var WebsiteMessage = db.Model.extend(

   ///////////////////////////////////////////////////////////////////////////////////
   //
   // THIS IS WHERE YOU DEFINE THE MODEL (table, primary key, relationships, instance methods)
   //
   ///////////////////////////////////////////////////////////////////////////////////
   {
      tableName: 'website_message',
      idAttribute: 'id',


      recipients: function() {

         //
         // Some craziness trying to understand this. So this returns all "user" rows linked to this "website_message"
         // row through the "website_message_recipient" table.
         //
         // Parms: 
         //    (1) User table, 
         //    (2) linking table => "website_message_recipient", 
         //    (3) FK from "website_message_recipient" that references this "website_message" row,
         //    (4) FK from "website_message_recipient" that references a row in "user"
         //
         return this.belongsToMany(db.model('User'), 'website_message_recipient', 'website_message_id','user_id');
      },

      recipient: function() {
         return this.hasOne(db.model('WebsiteMessageRecipient'), 'website_message_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      sentByUser: function() {
         return this.belongsTo(db.model('User'), 'sent_by_user_id'); 
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
            sent_datetime: new Date(),
         }
      },

      constructPrimaryKey : function(rowData) {
          return {
              id:rowData.id
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
module.exports = db.model('WebsiteMessage', WebsiteMessage);

