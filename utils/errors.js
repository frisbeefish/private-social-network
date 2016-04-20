var util = require('util');

function HTTPError(message) {
   Error.call(this,arguments);
}
util.inherits(HTTPError,Error);

function NotFoundError(message) {
   HTTPError.call(this);
   Error.captureStackTrace(this,arguments.callee);
   this.statusCode = 404;
   this.message = message;
   this.name = 'NotFound';
}
util.inherits(NotFoundError,HTTPError);

module.exports = {
    HTTPError:HTTPError,
    NotFoundError:NotFoundError
}