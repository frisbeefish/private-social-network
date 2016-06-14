"use strict";

const MAIN_MODEL = 'WebsiteMessage';
const WEBSITE_MESSAGE_RECIPIENT_MODEL = 'WebsiteMessageRecipient';
const WEBSITE_MESSAGE_FOLDER_MODEL = 'WebsiteMessageFolder';

const INBOX_FOLDER = "Inbox"
const SENT_FOLDER = "Sent"
const SAVED_FOLDER = "Saved"

var moment = require('moment');
var Errors = require('../utils').Errors;
var omit = require('../utils').Tools.omit;

/*
var Community = require('../models').Community;
var Discussion = require('../models').Discussion;
var DiscussionComment = require('../models').DiscussionComment;
var DiscussionCategory = require('../models').DiscussionCategory;
*/


var dbCount = require('./db_adapter').count;
var dbGetList = require('./db_adapter').list;
var dbGetOne = require('./db_adapter').get;
var dbInsert = require('./db_adapter').insert;
var dbUpdate = require('./db_adapter').update;
var dbDelete = require('./db_adapter').deleteRow;
var dbTransaction = require('./db_adapter').withTransaction;


///////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS
//
///////////////////////////////////////////////////////////////////////////////////


function createWebsiteMessage (tx,communityId,sentByUserId, recipientId, websiteMessageFolderId,
    subject, body, originalSentEmailMessageId) {

   console.error('CREATE MESSAGE');

   return dbInsert({ 
      '_modelName':MAIN_MODEL, 
      community_id:communityId,
      sent_by_user_id:sentByUserId, 
      recipient_id:recipientId, 
      website_message_folder_id:websiteMessageFolderId, 
      subject,
      body, 
      original_sent_email_message_id:originalSentEmailMessageId 
   });
}

         //
         // 2. Get the sent message's id. Now, for each recipient:
         //
         //    2.a. Create a message in the recipient's inbox.
         //
         //    2.b. Create a website_message_recipient row.
         //

function sendMessageToRecipient(tx,communityId,sentByUserId, recipientUserId,subject, body, sentEmailMessageId) {
   return new Promise(function(resolve,reject) {
      //
      // First, add the message to the recipient's inbox.
      //
      return createWebsiteMessage (tx,communityId,sentByUserId, recipientUserId, 
         messageFolderNameToIdMap[INBOX_FOLDER], subject, body, sentEmailMessageId)

      //
      // Now, create a 'website_message_recpient' row that links the message to the recipient.
      //
      .then(function(message) {
         return dbInsert({ '_modelName':WEBSITE_MESSAGE_RECIPIENT_MODEL,
            website_message_id:message.get('id'),user_id:recipientUserId});
      })

      .then(function() {
         resolve();
      })

      .catch( function(err) {
         reject(err);
      })
   })
}


function sendMessageToRecipients(tx, communityId, sentByUserId, allRecipientUserIds ,subject, body, sentEmailMessageId) {
    let promises = [];
    allRecipientUserIds.forEach(function(recipientUserId) {
       let sentToOneUserPromise = sendMessageToRecipient(tx,communityId,sentByUserId, recipientUserId,
          subject, body, sentEmailMessageId);
       promises.push(sentToOneUserPromise);
    });

    //
    // Send all of the messages to all of the recipients here.
    //
    return Promise.all(promises);
}
 
/**
 * Returns a list of discussions from the database.
 *
 * @param {number} communityId - The id of the community whose discussions will be returned.
 * @param {number} offset - (Optional) the first row (of the SELECT) to return
 * @param {number} limit - (Optional) the number of rows to return
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns the discussions as a a collection of {Model}.
 */
function getList(communityId, offset, limit, withRelated) {
   offset = offset || 0;
   limit = limit || 10;
   withRelated = withRelated || {}

   return dbGetList(
      MAIN_MODEL, // Model (the db table)
      [
         ['community_id', '=', communityId]
      ], // The where clause
      [
         ["creation_date_time", "desc"]
      ], // The order by clause
      withRelated, // Load these relations as well...
      offset, limit
   );
}


/**
 * Returns a discussion based on its id.
 *
 * @param {number} communityId - The id of the community whose discussion will be returned.
 * @param {number} discussionId - The id of the discussion to return.
 * @param {object} withRelated - (Optional) The Bookshelf JS clause that will be passed into a fetch() call.
 *
 * @return {Promise} A promise that returns a {Model} for the returned discussion.
 */
function getDiscussionById(communityId, discussionId, withRelated) {
   withRelated = withRelated || {}

   return dbGetOne(MAIN_MODEL, [
      ['community_id', '=', communityId],
      ['discussion_id', '=', discussionId]
   ], withRelated)

   //
   // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
   //
   .catch(function(err) {
      return Promise.reject(new Errors.NotFoundError('No discussion found with the specified id'));
   });
}

//
// This will contain a mapping of folder name to database id.
//
let messageFolderNameToIdMap = {};

//
// Load the list of folder names to database ids once.
//
(function() {
   dbGetList(
      WEBSITE_MESSAGE_FOLDER_MODEL
   )
   .then(function(folders) {
      folders.toJSON().forEach(function(folder) {
         messageFolderNameToIdMap[folder.name] = folder.id;
      });
   })
   .catch(function(err) {
       console.error('Failed to load message folders list: ' + err);
       process.exit(0);
   })
})();



module.exports = {

   /**
    * Returns a list of inbox messages for the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose messages will be returned.
    * @param {number} userId - The id of the user whose messages will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the inbox messages as a a collection of {Model}.
    */
   inboxMessages(communityId, userId, offset, limit) {
       offset = offset || 0;
       limit = limit || 10;

       return dbGetList(
          MAIN_MODEL, // Model (the db table)
          [
             ['community_id', '=', communityId],
             ['recipient_id', '=', userId],
             ['website_message_folder_id', '=', messageFolderNameToIdMap[INBOX_FOLDER],
             ['deleted', '=', 'N'] ]
          ], // The where clause
          [
             ["sent_datetime", "desc"]
          ], // The order by clause
          {withRelated:['recipient','sentByUser']}, // Load these relations as well...
          offset, limit
       );
   },

   getInboxMessage(messageId) {

       return dbGetOne(MAIN_MODEL, [
          ['id', '=', messageId]
       ],{withRelated:['recipient','recipients','sentByUser']})

       //
       // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
       //
       .catch(function(err) {
          console.error(err);
          return Promise.reject(new Errors.NotFoundError('No message found with the specified id'));
       });

   },

   sendMessage(communityId,sentByUserId,to,subject,body) {
      return dbTransaction(function(tx) {

         let sentMessage = null;
         let sentEmailMessageId = null;

         //
         // 1. Create "sent" message in sender's "sent" folder.
         //
         return createWebsiteMessage (tx,communityId,sentByUserId, sentByUserId, messageFolderNameToIdMap[SENT_FOLDER],
            subject, body)

         //
         // 2. Send a message to each recipient.
         //
         .then(function(message) {
            sentMessage = message;
            sentEmailMessageId = message.get('id');
            return sendMessageToRecipients(tx, communityId, sentByUserId, to,subject, body, sentEmailMessageId)
         } )

         //
         // Once those tasks are done, return the newly created/sent message to the client.
         //
         .then(function() {
            return Promise.resolve(sentMessage);
         } )
      });
   },

/*
            //
            // STEP 1: Get the message to delete.
            //
            var getMessageToDelete = function() { 
                return new Promise( function (resolve,reject) {
                    getWebsiteMessageById(id)
                    .then( function (message) {
                        message = message.toJSON();
                        if (message.recipient_id != user_id) {
                           reject("Illegal access. You do not own this email");
                        } else {


             //
             // Get the "progenitor/original" email from which the one to be deleted was cloned.
             // "originalMessage" will be that original email.
             //
             if (!message.original_sent_email_message_id) {
                  resolve(
                      {
                          message:message,
                          originalMessage:message
                      }
                  );
             } else {
                  getWebsiteMessageById(message.original_sent_email_message_id)
                  .then(function(originalMessage) {
                      resolve(
                          {
                              message:message,
                              originalMessage:originalMessage.toJSON()}
                      );
                  })
                  .catch(reject);
             }


            //
            // STEP 2. Mark the message as "deleted" so that it no longer shows up in the user's UI.
            //
            var markMessageAsDeleted = function(context) { 
                return new Promise( function (resolve,reject) {
                    dbcalls.update(models.WebsiteMessage,{id:context.message.id},{deleted:"Y"})
                    .then( function () {
                        //console.log("MESSAGE: " + context.message);
                        //console.log("ORIG originalMessage: " + context.originalMessage);
                        resolve(context);
                    })
                    .catch(reject);
                });
            }



            //
            // STEP 3. How many sibling clones are still undeleted? If 0, then we might be ready to do special processing.
            //
            var getCountOfUndeletedSiblingEmails = function(context) { 
                return new Promise( function (resolve,reject) {
                    console.log ("CONTEXT: " + context);
                    console.log(" context.originalMessage: " + context.originalMessage );
                    dbcalls.getCountWhere(models.WebsiteMessages,{
                        deleted:"N",
                        original_sent_email_message_id:context.originalMessage.id
                    })
                    .then( function (count) {
                        context.numberOfUndeletedSiblings = count;
                        resolve(context);
                    })
                    .catch(reject);
                });
            }


            //
            // STEP 4. If there are no more siblings, then we can delete all the sibling emails
            // as well as this one.
            //
            var deleteMessageAndAllSiblingMessagesIfPossible = function(context) { 
                return new Promise( function (resolve,reject) {
                    if (context.numberOfUndeletedSiblings > 0) {
                        resolve("Cannot delete yet. There are still siblings");
                    } else {
                       // resolve("CAN NOW DELETE. There are still siblings");
                        var originalMessageId = context.originalMessage.id;

                        dbcalls.selectWhereRaw(models.WebsiteMessages,
                            `original_sent_email_message_id = ${originalMessageId} or id = ${originalMessageId}`,
                            "recipient_id")

                        .then(function(messages) {
                           
                            console.log("HAVE MESSAGES");

                           //
                           // Not the most efficient. This goes out and does a DELETE of message one at a time.
                           // I just couldn't think any more. So this works for now. A WHERE would be better. But I'm too
                           // lazy today!
                           //
                           // deleteWithoutRelated
                           //          
                           var deleteMessageAndRecipientRowPromises = messages.map(function(message) {
                              return new Promise( function (resolve,reject) {
                                  var website_message_id = message.get("id");
                                  var recipient_id = message.get("recipient_id");

    //
    // HACK. NEEDED TO DO IT THIS WAY BECAUSE Bookshelf WAS FIGHTING WITH ME.
    //
                                  knex("website_message_recipient").where({
                                     website_message_id,
                                     user_id:recipient_id
                                  }).del()
                                  .then(function (numRows) {
                                    console.log(numRows + ' linking rows have been deleted');
                                    dbcalls.deleteWithoutRelated(models.WebsiteMessage,{id:website_message_id})
                                    .then(resolve).catch(reject)
                                  }).catch(function (err) {
                                    console.log(err);
                                    reject(err);
                                  });

                              });
                           });
                           Promise.all(deleteMessageAndRecipientRowPromises).then(resolve).catch(reject);
                        })
                        .catch(reject)
                    }
                });
            }

*/

   deleteMessage(communityId, userId, messageId) {

      return dbTransaction(function(tx) {

         let messageToDelete = null;
         let firstMessageInThread = null;

         //
         // 1. Get the message that will be deleted.
         //
         return dbGetOne(MAIN_MODEL, [
            ['id', '=', messageId],
            ['recipient_id', '=', userId]
         ],{require:true})


         //
         // 2. Get references to the message to delete and the original message (the one that was 
         //    the parent of the one to delete).
         //
         .then(function(message) {
            messageToDelete = message;
            //
            // If the message has no 'original message,' then it is the first one in the thread.
            //
            if (!message.get('original_sent_email_message_id')) {
               firstMessageInThread = message;
               return Promise.resolve(true);
            //
            // Otherwise, we need to look up the first one in the thread and get it from the database.
            //
            } else {
               return dbGetOne(MAIN_MODEL, [
                  ['id', '=', messageToDelete.get('original_sent_email_message_id')]
                  ],{require:true})
               .then(function(message) {
                  firstMessageInThread = message;
               })
            }
         })

         //
         // 3. Mark the message as "deleted" so that it no longer shows up in the user's UI.
         //
         .then(function() {
            return dbUpdate({
               '_modelName':MAIN_MODEL,  // Model 
               id:messageId,             // Where...
               deleted:'Y'               // Values to update.
            },tx);
         })

         //
         // 4. Get a count of the number of sibling emails (to the one being deleted) that have not
         //    yet been deleted. If all the siblings have been deleted, this value will be zero.
         //
         .then(function() {
            return dbCount(MAIN_MODEL,
              [['deleted', '=', 'N'], ['original_sent_email_message_id', '=', firstMessageInThread.get('id') ]]
            )
         })

/*
            var getCountOfUndeletedSiblingEmails = function(context) { 
                return new Promise( function (resolve,reject) {
                    console.log ("CONTEXT: " + context);
                    console.log(" context.originalMessage: " + context.originalMessage );
                    dbcalls.getCountWhere(models.WebsiteMessages,{
                        deleted:"N",
                        original_sent_email_message_id:context.originalMessage.id
                    })
                    .then( function (count) {
                        context.numberOfUndeletedSiblings = count;
                        resolve(context);
                    })
                    .catch(reject);
                });
            }

*/


         .then(function(message) {
console.error('RESPONSE FROM COUNT: ' + message);
            return Promise.resolve(true);
         })
         .catch(function(err) {
            if (err.message === 'EmptyResponse') {
               return Promise.reject(new Errors.NotFoundError('No message found with the specified id'));
            } else {
               return Promise.reject(err);
            }            
         })

/*
         .catch(function(err) {

            return Promise.reject(new Errors.NotFoundError('No discussion found with the specified id'));

         })
*/


/*
         //
         // First, delete the comment.
         //
         return dbDelete({
            '_modelName': COMMENT_MODEL,
            discussion_comment_id: discussionCommentId
         }, tx)

         //
         // Then, get the discussion whose comment was deleted.
         //

         .then(function() {
            return dbGetOne(MAIN_MODEL, [
               ['discussion_id', '=', discussionId]
            ])
         })

         //
         // Then decrement the comment_count of the discussion by one.
         //
         .then(function(discussion) {
            let commentCount = discussion.toJSON().comment_count - 1;
            return dbUpdate({
               '_modelName': MAIN_MODEL,
               discussion_id: discussionId,
               comment_count: commentCount
            }, tx);
         })
  */

      });

   },

   /**
    * Returns a list of outbox messages for the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose messages will be returned.
    * @param {number} userId - The id of the user whose messages will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the outbox messages as a a collection of {Model}.
    */
   outboxMessages(communityId, userId, offset, limit) {
       offset = offset || 0;
       limit = limit || 10;

       return dbGetList(
          MAIN_MODEL, // Model (the db table)
          [
             ['community_id', '=', communityId],
             ['sent_by_user_id', '=', userId],
             ['website_message_folder_id', '=', messageFolderNameToIdMap[SENT_FOLDER],
             ['deleted', '=', 'N'] ]
          ], // The where clause
          [
             ["sent_datetime", "desc"]
          ], // The order by clause
          {withRelated:['recipient','sentByUser']}, // Load these relations as well...
          offset, limit
       );
   },


   getOutboxMessage(messageId) {

       return dbGetOne(MAIN_MODEL, [
          ['id', '=', messageId]
       ],{withRelated:['recipient','recipients','sentByUser']})

       //
       // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
       //
       .catch(function(err) {
          console.error(err);
          return Promise.reject(new Errors.NotFoundError('No message found with the specified id'));
       });

   },


   /**
    * Returns a list of saved messages for the specified user in the specified community.
    *
    * @param {number} communityId - The id of the community whose messages will be returned.
    * @param {number} userId - The id of the user whose messages will be returned.
    * @param {number} offset - (Optional) the first row (of the SELECT) to return
    * @param {number} limit - (Optional) the number of rows to return
    *
    * @return {Promise} A promise that returns the saved messages as a a collection of {Model}.
    */
   savedMessages(communityId, userId, offset, limit) {
       offset = offset || 0;
       limit = limit || 10;

       return dbGetList(
          MAIN_MODEL, // Model (the db table)
          [
             ['community_id', '=', communityId],

             //
             // Raw where clause for now.
             //
             ` ( ( recipient_id = ${user_id} AND original_sent_email_message_id IS NOT NULL ) OR ( sent_by_user_id = ${user_id} AND original_sent_email_message_id IS NULL ) ) `,
             

             ['website_message_folder_id', '=', messageFolderNameToIdMap[SAVED_FOLDER],
             ['deleted', '=', 'N'] ]
          ], // The where clause
          [
             ["sent_datetime", "desc"]
          ], // The order by clause
          {withRelated:['recipient','sentByUser']}, // Load these relations as well...
          offset, limit
       );
   },


   getSavedMessage(messageId) {

       return dbGetOne(MAIN_MODEL, [
          ['id', '=', messageId]
       ],{withRelated:['recipient','recipients','sentByUser']})

       //
       // Rather than returning the default error created by Bookshelf JS, we'll return our own error.
       //
       .catch(function(err) {
          console.error(err);
          return Promise.reject(new Errors.NotFoundError('No message found with the specified id'));
       });

   },





   /**
    * Deletes an existing discussion comment from the database.
    * 
    * @param {number} discussionId - The id of the discussion that owns the comment.
    * @param {number} discussionCommentId - The id of the discussion comment to delete.
    *
    * @return {Promise} A promise with an empty success value if everything goes well.
    */
   deleteDiscussionComment(postedByUserId, discussionId, discussionCommentId) {
      return dbTransaction(function(tx) {

         //
         // First, delete the comment.
         //
         return dbDelete({
            '_modelName': COMMENT_MODEL,
            discussion_comment_id: discussionCommentId
         }, tx)

         //
         // Then, get the discussion whose comment was deleted.
         //

         .then(function() {
            return dbGetOne(MAIN_MODEL, [
               ['discussion_id', '=', discussionId]
            ])
         })

         //
         // Then decrement the comment_count of the discussion by one.
         //
         .then(function(discussion) {
            let commentCount = discussion.toJSON().comment_count - 1;
            return dbUpdate({
               '_modelName': MAIN_MODEL,
               discussion_id: discussionId,
               comment_count: commentCount
            }, tx);
         })
      });
   }

}