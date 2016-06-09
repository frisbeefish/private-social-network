

"use strict";

var express = require('express');
var router = express.Router();

/*
var captureExceptions = require('./utils').captureExceptions;

*/

//if (let debugDb = process.env.NODE_ENV === 'test' ? false : true;)

/*
err, req, res, next
*/

function captureExceptions(fn) {
    var wrapper = function() {
        var args = Array.prototype.slice.call(arguments);
        try {
            //console.error('NUMBER OF ARGS: ' + args.length);
            //console.error('APP: ' + args[0].app);
            //console.error('APP 2: ' + args[1].app);
            //console.error('EMIT?: ' + args[0].app.emit);
            return fn.apply(null,args);
        } catch (exc) {
            return args[0].app.emit('error',exc);
            //return process.emit('uncaughtException',exc);
        }
    }
    return wrapper;
}

module.exports = {
    Router() {
        var router = express.Router();

        //
        // Monkey patch the router so that it throws exceptions (such as undefined varlable through the process 'uncaughtException')
        // mechanism.
        //
        // NOTE: If we don't do this, then things like references to undefined variables won't be seen or reported. The
        // code will just quietly fail unless you install 'try/catch' everywhere within your code. And that would suck.
        //
        // What this does is that the route callbacks will be invoked within a try/catch block. If any JavaScript errors
        // occur within those blocks, those errors (which are FAIL!!!/FATAL!!!) problems with the code, will be
        // forwarded to the 'uncaughtException' handler. And that should halt the app.
        //
        if (process.env.NODE_ENV !== 'production') {

            let _get = router.get;
            router.get = function() {
                var args = Array.prototype.slice.call(arguments);
                var wrapper = captureExceptions.apply(null,args.slice(1));
                _get.apply(this,[args[0],wrapper]);
            }

            let _post = router.post;
            router.post = function() {
                var args = Array.prototype.slice.call(arguments);
                var wrapper = captureExceptions.apply(null,args.slice(1));
                _post.apply(this,[args[0],wrapper]);
            }

            let _put = router.put;
            router.put = function() {
                var args = Array.prototype.slice.call(arguments);
                var wrapper = captureExceptions.apply(null,args.slice(1));
                _put.apply(this,[args[0],wrapper]);
            }

            let _delete = router.delete;
            router.delete = function() {
                var args = Array.prototype.slice.call(arguments);
                var wrapper = captureExceptions.apply(null,args.slice(1));
                _delete.apply(this,[args[0],wrapper]);
            }

        }
        return router;
    }
}