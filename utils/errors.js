var util = require('util');

function HTTPError(message) {
   Error.call(this,arguments);
}
util.inherits(HTTPError,Error);

function NotFoundError(message) {
   HTTPError.call(this);
   Error.captureStackTrace(this,arguments.callee);
   this.status = 404;
   this.message = message;
   this.name = 'NotFound';
}
util.inherits(NotFoundError,HTTPError);

function NotImplementedError(url) {
   NotFoundError.call(this,"Not Implemented : " + url);
}
util.inherits(NotImplementedError,NotFoundError);

module.exports = {
    HTTPError:HTTPError,
    NotFoundError:NotFoundError,
    NotImplementedError:NotImplementedError
}