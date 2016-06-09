/*****************************************************************************************
 *
 * DEPRECATE THIS MODULE. 
 *
 * DO NOT USE THESE CALLS. MOVED TO "jsondb.js" TECHNIQUE!!!
 *
 **/








"use strict";

var Errors = require('../utils').Errors;

let _ = require('underscore');

module.exports = {

    exists (model,findOneQuery) {
        return new Promise( function (resolve,reject) {
            new model(findOneQuery).fetch().then(function(row) {
                return resolve(row !== null);
            }).catch(function(err) {
                return reject(err);
            });
        });        
    },
    
    insert(ModelClass,props) {
        return ModelClass.forge(
            _.extend(ModelClass.newRowDefaults(),props)
        ).save()
    },

    update(ModelClass,primaryKeyProp,props) {
        return ModelClass.forge(primaryKeyProp)
            .fetch({require:true})
            .then(function(row) {
                return row.save(props);
            })
    },


    deleteAtomic(ModelClass,primaryKeyProp) {
        return ModelClass.forge(primaryKeyProp)
        .fetch({require:true})
        .then(function(row) {
            return row.destroy();
        })
    },

    deleteWithoutRelated(ModelClass,primaryKeyProp) {
        return new Promise(function(resolve,reject) {
            //
            // First, look up the post that will be deleted.
            //
            ModelClass.forge(primaryKeyProp)
            .fetch({require:true})

            //
            // Now, delete.
            //
            .then(function(row) {
                console.log("HAVE ROW: " + row.toJSON());
                console.log("ROW: " + JSON.stringify(row));
                row.destroy()
                .then(function(err) {
                    console.log("DID THE DELETE");
                    resolve(err);
                })
                .catch(function(err) {
                    console.log("FAILED TO DDO THE DELETE: " + err);
                    reject(err);
                })
            })
            .catch(function(err) {
                console.log("OUTER FAIL TO DELETE " + err);
                reject(err);
            })
        });
    },


    deleteWithRelated(ModelClass,primaryKeyProp,relationshipName) {
        return new Promise(function(resolve,reject) {
            //
            // First, look up the post that will be deleted.
            //
            ModelClass.forge(primaryKeyProp)
            .fetch({require:true,withRelated:[relationshipName]})
            .then(function(parentRow) {

                //
                // "invokeThen" on a promise will invoke the passed-in function name on all
                // the promises in the set of "related". Once all the resolves are done, it invokes "then" or
                // "catch"
                //
                // What we do here is delete the related child elements.
                //
                parentRow.related(relationshipName).invokeThen('destroy').then(function () {

                    //
                    // Now, delete the parentRow itself.
                    //
                    parentRow.destroy()
                    .then(function(err) {resolve(err);})
                    .catch(function(err) {reject(err);})
                })
            })
            .catch(function(err) {reject(err);})
        });
    }
}

