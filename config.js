
"use strict";

//
// Start your app with environment variables, like this (or something): 
//
//    DB_USER=mydbuser DB_PASSWORD=mypass forever -w ./bin/www
//

let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let debugDb = process.env.NODE_ENV === 'test' ? false : true;

module.exports = {

    db:{
        client:"mysql",
        connection: {
            host     : 'localhost',
            user     : dbUser,
            password : dbPassword,
            database : 'groupcafes',
            charset  : 'utf8'
        },
        debug: debugDb
    }

}
