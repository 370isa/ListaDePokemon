'use strict';

const server = require('./express/server');

server.listen(5000, () => console.log('Server is running!'));