'use strict';

var app = require('angular').module('caritathelp');

app.directive('comment', require('./comment'));
app.controller('commentController', require('./commentController'));
