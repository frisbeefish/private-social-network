"use strict";

let path = require('path');

let db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');
require('./user');


var CommunityUser = db.Model.extend(
   {
      tableName: 'community_user',
      //idAttributes: ['community_id','user_id'],

      //
      // NOTE! Trying to specify two columns here broke stuff.
      //
      idAttribute: ['community_id'], //,'community_user.user_id'],
      

      community: function() {
         return this.hasOne(db.model('Community'), 'community_id'); 
      },

      user: function() {
         return this.hasOne(db.model('User'), 'user_id'); 
      }
   },
   {
      newRowDefaults: function() {
         return {
            show_personal_info:"Y",
            is_admin:"N"
         }
      }
   }
);

module.exports = db.model('CommunityUser', CommunityUser);