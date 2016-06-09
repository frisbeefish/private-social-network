"use strict";

var _ = require("underscore");

module.exports = {

    insert(ModelClass,props) {
        console.error('INSIDE INSERT');
        return ModelClass.forge(
            _.extend(ModelClass.newRowDefaults(),props)
        ).save();
    },


    update(ModelClass,primaryKeyProp,props) {
        return new Promise(function(resolve,reject) {
            ModelClass.forge(primaryKeyProp)
            .fetch({require:true})
            .then(function(row) {
                row.save(props)
                .then(function(err) {resolve(err);})
                .catch(function(err) {reject(err);})
            })
            .catch(function(err) {reject(err);})
        });  
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
                console.log("OUTER FAIL TO DELETE, err: " + err);
                reject(err);
            })
        });
    },

    deleteLinkingTableWithoutRelated(ModelClass,primaryKeyProp) {
        return new Promise(function(resolve,reject) {
            //
            // First, look up the post that will be deleted.
            //
            ModelClass.forge()
            .query(function(q) {
                q.where(primaryKeyProp)
            })
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
                console.log("OUTER FAIL TO DELETE");
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
    },


    selectAll(ModelClass,orderBy) {
        return ModelClass.forge().query(function(q){q.orderBy(orderBy)}).fetch();
    },

    selectWhere(ModelClass,whereProps,orderBy) {
        return ModelClass.forge().query(function(q){q.where(whereProps).orderBy(orderBy)}).fetch();
    },

    selectWhereRaw(ModelClass,whereRaw,orderBy) {
        return ModelClass.forge().query(function(q){q.whereRaw(whereRaw).orderBy(orderBy)}).fetch();
    },

    getCountWhere(ModelClass,whereProps) {
        return new Promise(function(resolve,reject) {
            ModelClass.forge().query(function(q){q.where(whereProps)}).fetch()
            .then(function(collection) {resolve(collection.length)})
            .catch(reject);
        });
    },

    selectPageOfRowsWithWhere(ModelClass,whereProps,orderBy,offset,limit,withRelated) {
        offset = offset || 0;
        limit = limit || 10;

        return ModelClass.forge().query(function(q){q.where(whereProps).orderBy(orderBy[0],orderBy[1]).offset(offset).limit(limit)}).fetch({withRelated:withRelated});
        //return ModelClass.forge(whereProps).query(function(q){q.orderBy(orderBy[0],orderBy[1]).offset(offset).limit(limit)}).fetch({withRelated:withRelated});
    },

    //
    // withRelated can be undefined if no child relationships to retrieve.
    //
    selectOneById(ModelClass,primaryKeyProp,withRelated) {
        return ModelClass.forge(primaryKeyProp).fetch({require:true,withRelated:withRelated});
    },

    //
    // withRelated can be undefined if no child relationships to retrieve.
    //
    selectOneByProps(ModelClass,props,withRelated) {
        return ModelClass.forge(props).fetch({require:true,withRelated:withRelated});
    }

}