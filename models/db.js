"use strict";

var config = require("../config");

console.log("CONFIG: ", config);
console.log("DB: " + config.db);

var knex = require('knex')(config.db);

var bookshelf = require('bookshelf')(knex);

//
// Read this post about circular imports!
// Link: http://billpatrianakos.me/blog/2015/11/30/how-to-structure-bookshelf-dot-js-models/
//
bookshelf.plugin('registry');

module.exports = {
    knex,
    db:bookshelf
}