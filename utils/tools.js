"use strict";

var _ = require('underscore') 


module.exports = {
    clone(obj) {
        return _.clone(obj);
    },
    omit(obj,keys) {
        return _.omit(obj, keys);
    }
}