// Importing packages/modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const signale = require('signale');
const sgMail = require('@sendgrid/mail');
const session = require('express-session');


//Importing routes
const routes = require('./routes/index.router');

// Importing configuration file
const config = require('./config/config');

// env/config variables
const APP_PORT = config.ports.APP_PORT || 8000;
const MONGODB_URI = config.mongodb.DB_URI;
const SESSION_SECRET = config.session.secretString;

// Adding options for CORS middleware
const corsOptions = {
	origin: config.url.CORS_ORIGIN,
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	credentials: true
};

// Initialising express
const app = express();
const router = express.Router();

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true })
	.then(() => {
		signale.success('*****Database Connection Successfull******');
	}).catch(err => {
		signale.fatal(new Error(err));
		signale.warn('Could not connect to Database. Exiting now...');
		process.exit();
	});
let db = mongoose.connection;

// Initialize body-parser middleware
app.use(bodyParser.json(), cors(corsOptions));
app.use(bodyParser.urlencoded({
	extended: true
}));

// Initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// Middlewares for expressValidator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
	secret: SESSION_SECRET,
	resave: true,
	saveUninitialized: false
}));

app.use(routes);

app.get('/',(req,res) => {
	return res.send('What are you doing here? :p');
});

app.all('*', (req, res) => {
	signale.error('Returning a 404 from the catch-all route');
	return res.sendStatus(404);
});

exports.start = () => {
	app.listen(APP_PORT, () => {
		signale.success(`App server listening on port: ${APP_PORT}`);
	});
}

exports.stop = () => {
	app.close(APP_PORT, () => {
		signale.success(`App server shut down on port: ${APP_PORT}`);
	});
}