// Importing packages/modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const logger = require('./config/winston');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sgMail = require('@sendgrid/mail');
const signale = require('signale');

//Importing routes
const routes = require('./routes/index.router');

// Importing configuration file
const config = require('./config/config');

// env/config variables
const APP_PORT = config.ports.APP_PORT || 8000;
const SESSION_SECRET = config.session.secretString;

// Database connection options
let dbConnectionOptions = {
	dbName: config.mongodb.DB_NAME,
    	reconnectTries: Number.MAX_SAFE_INTEGER,
    	useNewUrlParser: true,
    	useCreateIndex: true
};


// Setting MONGODB_URI
let MONGODB_URI = `mongodb://${config.mongodb.DB_HOST}:${config.mongodb.DB_PORT}/${config.mongodb.DB_NAME}`;

// Update db params if database authenication is enabled
if(config.mongodb.DB_AUTH_ENABLED){
	MONGODB_URI = `mongodb://${config.mongodb.DB_USERNAME}:${config.mongodb.DB_PASSWORD}@${config.mongodb.DB_HOST}:${config.mongodb.DB_PORT}/${config.mongodb.DB_NAME}?authSource=${config.mongodb.DB_AUTH_SOURCE}`;
	
	// Adding DB credentials
	dbConnectionOptions.user = config.mongodb.DB_USERNAME;
	dbConnectionOptions.pass = config.mongodb.DB_PASSWORD;
}

// Adding options for CORS middleware
const corsOptions = {
	origin: config.url.CLIENT_BASE_URL,
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	credentials: true
};

// Initialising express
const app = express();
const router = express.Router();


// Configuring public path
app.use(express.static(config.directory.PUBLIC_DIR));

// Configure loggers
app.use(morgan('combined', { stream: logger.stream }));

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, dbConnectionOptions)
	.then(() => {
		signale.success('*****Database Connection Successfull******');
	}).catch(error => {
		logger.error(error.toString());
		signale.fatal(new Error(error));
		signale.warn('Could not connect to Database. Exiting now...');
		process.exit();
	});
let dbConnection = mongoose.connection;

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
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	}),
	resave: true,
	saveUninitialized: false,
	cookie: { 
		maxAge: (1000 * 60 * 60) // 1 Hour 
	}
}));


// Set Sendgrid API key
sgMail.setApiKey(config.key.SENDGRID_API_KEY);

app.use(routes);

app.get('/', (req, res) => {
	return res.send('What are you doing here? :p');
});

// Route error handler
app.use( (err, req, res, next) => {
	// Log errors
	logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
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
