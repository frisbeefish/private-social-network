
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
   {
      tableName: 'website_message',
      idAttribute: 'id',

      recipient: function() {
         return this.hasOne(db.model('WebsiteMessageRecipient'), 'website_message_id'); // THIS WAS THE MAGIC!! Needed this parameter at the end.
      },

      sentByUser: function() {
         return this.belongsTo(db.model('User'), 'sent_by_user_id'); 
      },
   }
   /*
   {
      newRowDefaults: function() {
         return {
            sent_datetime: new Date(),
         }
      }
   }
   */
);



module.exports = db.model('WebsiteMessage', WebsiteMessage);

