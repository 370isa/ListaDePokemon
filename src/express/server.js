'use strict';

const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const server = express();
const router = require('./../routes');

server.use(express.static('dist'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
});


server.use(bodyParser.json());
server.use('/.netlify/functions/server', router); // path must route to lambda
server.use('/', (req, res) => res.sendFile(path.join(__dirname, '../views/list.njk')));

module.exports.handler = serverless(server);

server.use('/', router);
module.exports = server;