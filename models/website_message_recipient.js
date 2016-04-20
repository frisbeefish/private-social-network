

"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
//require('./website_message_recipient');
//require('./user');

var WebsiteMessageRecipient = db.Model.extend(
   {
      tableName: 'website_message_recipient',
      idAttributes: ['website_message_id','user_id'],
      idAttribute: ['website_message_id','user_id'],

       
   },
   {
      newRowDefaults: function() {
         return {
         }
      }
   }
);