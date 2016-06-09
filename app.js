"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride  = require("method-override");

var api = require('./api');

var pageRoutes = require('./routes/pages/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// See this post: http://stackoverflow.com/questions/24019489/node-js-express-4-x-method-override-not-handling-put-request
//
app.use(methodOverride('_method'))

//
// Or this?
//
/*
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
*/

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
   req.communityId = 1
   req.userId = 1
   //req.communityId = 5;
   next();
});

app.use('/api',api);
app.use('/',pageRoutes);

/*
app.use('/', routes.root);
app.use('/calendars', routes.calendar);
app.use('/communities', routes.communities);
app.use('/discussions', routes.discussions);
app.use('/messages', routes.messages);
app.use('/pages', routes.pages);
app.use('/posts', routes.posts);
app.use('/users', routes.users);
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.error('No route found for URL: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
  console.error('env: ' + app.get('env'))
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  
  app.use(function(err, req, res, next) {

 // console.error('IN DEV ERROR HANDLER');

  let status = err.status || 500;

  if (status >= 500) {
     console.error(err);
     console.error(err.stack);
  }

    res.status(status);


  res.format({
      text:function() {
          res.send(err.message);
      },
      json:function() {
          res.send(err);
      },
      html:function() {
        res.render('error', {
          message: err.message,
          error: {}
        });
      }
  });


  });
}

if (app.get('env') === 'test') {
  
  app.use(function(err, req, res, next) {

//  console.error('IN TEST ERROR HANDLER');

  let status = err.status || 500;

  if (status >= 500) {
     console.error(err);
     console.error(err.stack);
  }

    res.status(status);

  res.format({
      text:function() {
          res.send(err.message);
      },
      json:function() {
          res.send(err);
      },
      html:function() {
        res.render('error', {
          message: err.message,
          error: {}
        });
      }
  });


  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  
//  console.error('IN PROD ERROR HANDLER');

  let status = err.status || 500;

  if (status >= 500) {
     console.error(err);
     console.error(err.stack);
  }

  res.status(status);

  res.format({
      text:function() {
          res.send(err.message);
      },
      json:function() {
          res.send(err);
      },
      html:function() {
        res.render('error', {
          message: err.message,
          error: {}
        });
      }
  });
  
});

/*
var repl = require("repl");

var replServer = repl.start({
  prompt: "my-app > ",
});
*/

/*
process.on('uncaughtException', function(err) {
  console.error(err);
  console.error(err.stack);
  process.exit(0);
});
*/

app.on('error', function(err) {
  console.error(err);
  console.error(err.stack);
  process.exit(0);
});

module.exports = app;
