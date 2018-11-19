require('instana-nodejs-sensor')();

var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

app.get('/', function(req, res, next) {
  res.send('nowait');
});

module.exports = app;
