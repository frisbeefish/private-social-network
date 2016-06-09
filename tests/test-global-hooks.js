
var app = require('../app');

var http = require('http');

var server = null;

//
// This is global. It can be used from other test scripts.
//
TEST_PORT = 8000;

before(function() {
    console.log('*** GLOBAL BEFORE HOOK');
    server = http.createServer(app);
    server.listen(TEST_PORT);
});

after(function() {
    console.log('*** GLOBAL AFTER HOOK');
    server.close();
});
