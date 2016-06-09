"use strict";

var request = require('request');

module.exports = {
    get:function(path,callback) {
       var options = {
          url: 'http://localhost:' + TEST_PORT + path,
          headers: {
             'Content-Type': 'text/plain',
             'Accept': 'application/json'
          },
          json:true // This will parse the returned body into JSON. So the callback will get a JSON body not a string.
       };
       request.get(options, callback);
    },

    postJson:function(path,json,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          method: 'POST',
          json:json
       };
       request.post(options, callback);
    },

    //
    // See this link: https://github.com/request/request
    //
    //
    //  var formData = {
    //    // Pass a simple key-value pair
    //    my_field: 'my_value',
    //    // Pass data via Buffers
    //    my_buffer: new Buffer([1, 2, 3]),
    //    // Pass data via Streams
    //    my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
    //    // Pass multiple values /w an Array
    //    attachments: [
    //      fs.createReadStream(__dirname + '/attachment1.jpg'),
    //      fs.createReadStream(__dirname + '/attachment2.jpg')
    //    ],
    //    // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
    //    // Use case: for some types of streams, you'll need to provide "file"-related information manually.
    //    // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    //    custom_file: {
    //      value:  fs.createReadStream('/dev/urandom'),
    //      options: {
    //        filename: 'topsecret.jpg',
    //        contentType: 'image/jpg'
    //      }
    //    }
    //  };
    //  request.post({url:'http://service.com/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
    //    if (err) {
    //      return console.error('upload failed:', err);
    //    }
    //    console.log('Upload successful!  Server responded with:', body);
    //  });
    //


    postForm:function(path,formData,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          formData: formData,
          headers: {
             
             'Accept': 'application/json'
          },
          method: 'POST',
          json:true
       };
       request.post(options, callback);
    },

    putJson:function(path,json,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          method: 'PUT',
          json:json
       };
       request.put(options, callback);
    },

    patchJson:function(path,json,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          headers: {
             'Content-Type': 'text/plain',
             'Accept': 'application/json'
          },
          method: 'PATCH',
          json:json
       };
       request.patch(options, callback);
    },

    deleteJson:function(path,json,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          headers: {
             'Content-Type': 'text/plain',
             'Accept': 'application/json'
          },
          method: 'DELETE',
          json:json
       };
       request.delete(options, callback);
    }

}

/*
module.exports = {

    get:function(path,callback) {
       var options = {
          url: 'http://localhost:' + TEST_PORT + path,
          headers: {
             'Content-Type': 'text/plain',
             'Accept': 'application/json'
          },
          json:true // This will parse the returned body into JSON. So the callback will get a JSON body not a string.
       };
       request.get(options, callback);
    },



    deleteJson:function(path,json,callback) {
       var options = {
          url: 'http://localhost:8000' + path,
          headers: {
             'Content-Type': 'text/plain',
             'Accept': 'application/json'
          },
          method: 'DELETE',
          json:json
       };
       request.delete(options, callback);
    }

}
*/