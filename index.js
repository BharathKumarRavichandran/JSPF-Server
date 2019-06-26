// Start app server
require('./src/server').start();

// Start kue server
require('./src/kue.server').start();