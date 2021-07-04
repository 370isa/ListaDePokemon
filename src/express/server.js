'use strict';

const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.static('dist'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
});

// const router = server.use('/', require('./../routes'));

// server.use(bodyParser.json());
// server.use('/.netlify/functions/server', require('./../routes')); // path must route to lambda

server.use('/', require('./../routes'));

module.exports = server;
module.exports.handler = serverless(server);