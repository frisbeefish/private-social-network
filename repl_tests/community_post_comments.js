
Start repl.

var Community = require('./models/community');

Community.collection().fetch().then(function(c){console.log(c.toJSON());}).catch(function(exc){console.log(exc);});

new Community({community_id:1}).posts().fetch().then(function(c){console.log(c.toJSON());}).catch(function(exc){console.log(exc);});

//
// to delete from cache
//
// not working delete require.cache[require.resolve('./models/community')]


new Community({community_id:1}).postComments().fetch().then(function(c){console.log(c.toJSON());}).catch(function(exc){console.log(exc);});

