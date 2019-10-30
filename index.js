// Start app server
require('./src/server.js').start();

// Start kue server
require('./src/kue.server.js').start();