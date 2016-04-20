"use strict";

var db = require('./db').db;

//
// Require but don't save in a variable. This ensures that the models are loaded and added into
// the bookshelf registry of models. These are models that are referenced by the model defined in this
// file.
//
require('./community');


var SitePage = db.Model.extend({
  tableName: 'site_page',
  idAttribute: 'site_page_id', 

  communities: function() {
      return this.belongsToMany(db.model('Community'), 'community_site_page', 'site_page_id', 'community_id' );
  }
});


module.exports = db.model('SitePage', SitePage);
