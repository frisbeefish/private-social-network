"use strict";

var Errors = require('../utils').Errors;

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
    
    promisesSequence(promiseFactories) { 
        return new Promise( function (resolve,reject) {

            let queue = promiseFactories.slice();
            let lastResult = null;

            function processNextPromise() {
                let pFactory = queue.shift();
                if (!pFactory) {
                    return resolve(lastResult);
                } else {
                    //
                    // Create the promise using its factory. Pass in the last results.
                    //
                    pFactory(lastResult).then(function(result) {
                        lastResult = result;
                        processNextPromise();
                    }).catch(function(err) {
                        return reject(err);
                    });
                }
            }
            processNextPromise();

        });
    }

}

