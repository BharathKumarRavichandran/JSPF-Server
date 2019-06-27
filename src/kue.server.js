const express = require('express');
const kue = require('kue');
const ui = require('kue-ui');
const signale = require('signale');
const queue = kue.createQueue();

const app = express();

// Importing configuration file
const config = require('./config/config');

// env/config variables
const KUE_PORT = config.ports.KUE_PORT || 5000;

ui.setup({
    apiURL: '/api',
    baseURL: '/kue',
    updateInterval: 5000 // Optional: Fetches new data every 5000 ms 
});


// Mount kue JSON api 
app.use('/api', kue.app);

// Mount UI
app.use('/kue', ui.app);

// Route error handler
app.use( (err, req, res, next) => {
	// Log errors
	logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

app.all('*', (req, res) => {
	signale.error('Returning a 404 from the kue server catch-all route');
	return res.sendStatus(404);
});

exports.start = () => {
	app.listen(KUE_PORT, () => {
		signale.success(`Kue server listening on port: ${KUE_PORT}`);
	});
}

exports.stop = () => {
	app.close(KUE_PORT, () => {
		signale.success(`Kue server shut down on port: ${KUE_PORT}`);
	});
}