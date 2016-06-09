"use strict";

const MAIN_MODEL = 'Page';
const SUB_PAGE_MODEL = 'SubPage';
const PAGE_POST_MODEL = 'PagePost';
const PAGE_POST_SUB_ELEMENT_MODEL = 'PagePostSubelement';


var Page = require('../models').Page;
var SubPage = require('../models').SubPage;
var PagePost = require('../models').PagePost;
var PagePostSubelement = require('../models').PagePostSubelement;

var Errors = require('../utils').Errors;

var dbList = require('./db-adapter').list;
var dbGetOne = require('./db-adapter').get;
var dbInsert = require('./db-adapter').insert;
var dbUpdate = require('./db-adapter').update;
var dbDelete = require('./db-adapter').deleteRow;
var dbTransaction = require('./db-adapter').withTransaction;



///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////


/**
 * Returns the specified page.
 *
 * @param {number} communityId - The id of the community whose page will be returned.
 * @param {number} pageId - The id of the page to return.
 *
 * @return {Promise} A promise that returns the page as a {Model}.
 */
function getOnePage(communityId,pageId,withRelated) {
   withRelated = withRelated || {}

   return dbGetOne(MAIN_MODEL, 
      [ ['community_id', '=', communityId], ['id', '=', pageId] ], // Where
      withRelated
   )

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No page found with the specified id'));
   });
}

/**
 * Returns the a single sub page by id.
 *
 * @param {number} communityId - The id of the community whose page's sub page will be returned.
 * @param {number} pageId - The id of the page whose sub page will be returned.
 * @param {number} subPageId - The id of the sub page to return.
 *
 * @return {Promise} A promise that returns the sub page as a {Model}.
 */
function getSubPage(communityId, pageId, subPageId) {

   //
   // First, make sure the page exists.
   //

   return getOnePage(communityId, pageId,{withRelated:['subPages']})

   //
   // Return the sub page
   //
   .then(function(page) {
      return dbGetOne(SUB_PAGE_MODEL, [ ['id', '=', subPageId] ])
   })

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No page found with the specified id'));
   });
}

function getPagePost(communityId, pageId, pagePostId) {

   //
   // First, ensure that the page exists.
   //

   return getOnePage(communityId, pageId)

   //
   // Now, return the page post.
   //

   .then(function(page) {
      return dbGetOne(PAGE_POST_MODEL, [
         ['id', '=', pagePostId]
      ])
   })
}


module.exports = {

   /**
    * Returns a list of pages for the specific community.
    *
    * @param {number} communityId - The id of the community whose pages will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the pages as a a collection of {Model}.
    */
   list(communityId, offset, limit) {

      offset = offset || 0;
      limit = limit || 10;

      return dbList(
         MAIN_MODEL,                             // Model (the db table)
         [ ['community_id', '=', communityId] ], // The where clause
         [ ['page_type_id', 'asc'] ],            // The order by clause
         {},
         offset, limit
      );
   },

   /**
    * Returns the specified page.
    *
    * @param {number} communityId - The id of the community whose page will be returned.
    * @param {number} pageId - The id of the page to return.
    *
    * @return {Promise} A promise that returns the page as a {Model}.
    */
   get(communityId, pageId) {
      return getOnePage(communityId, pageId)
   },

   /**
    * Returns the sub pages of the specified page.
    *
    * @param {number} communityId - The id of the community whose page's sub pages will be returned.
    * @param {number} pageId - The id of the page whose sub pages will be returned.
    *
    * @return {Promise} A promise that returns the sub pages as a collection of {Model}.
    */
   subPages(communityId, pageId) {

      return getOnePage(communityId, pageId,{withRelated:['subPages']})

      //
      // Return the sub pages
      //
      .then(function(page) {
         return page.related('subPages')
      })

      //
      // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
      //
      .catch(function(err) {
         return Promise.reject(new Errors.NotFoundError('No page found with the specified id'));
      });
   },

   /**
    * Returns the a single sub page by id.
    *
    * @param {number} communityId - The id of the community whose page's sub page will be returned.
    * @param {number} pageId - The id of the page whose sub page will be returned.
    * @param {number} subPageId - The id of the sub page to return.
    *
    * @return {Promise} A promise that returns the sub page as a {Model}.
    */
   getSubPage(communityId, pageId, subPageId) {
      return getSubPage(communityId, pageId, subPageId)
   },

   /**
    * Returns the posts for a single sub page.
    *
    * @param {number} communityId - The id of the community whose page's sub page posts will be returned.
    * @param {number} pageId - The id of the page whose sub page posts will be returned.
    * @param {number} subPageId - The id of the sub page whose posts will be returned..
    *
    * @return {Promise} A promise that returns posts as a collection of {Model}.
    */
   subPagePosts(communityId, pageId, subPageId) {
      return getSubPage(communityId, pageId, subPageId)

      .then(function(subPage) {
         return subPage.pagePostsSorted()
      })
   },

   /**
    * Returns the all the posts for a page.
    *
    * @param {number} communityId - The id of the community whose page's posts will be returned.
    * @param {number} pageId - The id of the page whose page posts will be returned.
    *
    * @return {Promise} A promise that returns posts as a collection of {Model}.
    */
   posts(communityId, pageId) {
      return getOnePage(communityId, pageId)

      .then(function(page) {
         return page.pagePostsSorted();
      })
   },

   /**
    * Returns a single page post.
    *
    * @param {number} communityId - The id of the community whose page's post will be returned.
    * @param {number} pageId - The id of the page whose page post will be returned.
    * @param {number} pagePostId - The id of the page post.
    *
    * @return {Promise} A promise that returns the post as a {Model}.
    */
   getPagePost(communityId, pageId, pagePostId) {
      return getPagePost(communityId, pageId, pagePostId);
   },

   getPagePostSubposts(communityId, pageId, pagePostId) {

      //
      // First, ensure this is a valid page post
      //

      return getPagePost(communityId, pageId, pagePostId)

      //
      // Then return its sub posts (like the images of a gallery post or the files in a file post)
      //

      .then(function(pagePost) {
         return dbList(
            PAGE_POST_SUB_ELEMENT_MODEL,           // Model (the db table)
            [ ['page_post_id', '=', pagePostId] ], // The where clause
            [ ['order_number', 'asc'] ],           // The order by clause
            {}      
         );
      })
   }
}