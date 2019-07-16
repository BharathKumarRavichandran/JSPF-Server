const dotenv = require('dotenv');
const path = require('path');


// Declaring globals
const BASE_DIR = __dirname + '/./../../';

dotenv.config(
	{
		debug: process.env.DEBUG,
		path: __dirname + '/./../../.env'
	}
);

module.exports = {
	email: {
		SITE_NOREPLY_EMAIL: process.env.SITE_NOREPLY_EMAIL
	},
	date: {
		START_DATE: process.env.START_DATE,
		END_DATE: process.env.END_DATE,
		START_DATE_JS: process.env.START_DATE_JS,
		END_DATE_JS: process.env.END_DATE_JS,
		START_YEAR: process.env.START_YEAR,
		END_YEAR: process.env.END_YEAR
	},
	debug: process.env.debug,
	directory: {
		BASE_DIR: BASE_DIR,
		CLIENT_BASE_DIR: process.env.CLIENT_BASE_DIR,
		CONFIG_DIR: path.join(BASE_DIR, 'src', 'config'),
		LOGS_DIR: path.join(BASE_DIR, 'storage', 'logs'),
		PUBLIC_DIR: process.env.environment=='production' ? path.join(process.env.CLIENT_BASE_DIR, 'public') : path.join(BASE_DIR, 'public'),
		SRC_DIR: path.join(BASE_DIR, 'src'),
		UPLOADS_DIR: process.env.environment=='production' ? path.join(process.env.CLIENT_BASE_DIR, 'public', 'uploads') : path.join(BASE_DIR, 'public', 'uploads')
	},
	environment: process.env.environment,
	files: {
		archive: {
			format: 'zip',
			mimeType: 'application/zip'
		},
		mentorsList : path.join(__dirname, 'mentorsList.json')
	},
	key: {
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
		google_auth: {
			credentials: path.join(__dirname, 'google_auth_credentials.json'),
			service_jwt: path.join(__dirname, 'google_auth_service_jwt.json'),
			TOKEN_PATH: path.join(__dirname, 'google_auth_token.json')
		},
	},
	mongodb: {
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_URI: process.env.DB_URI
	},
	ports: {
		APP_PORT: process.env.APP_PORT,
		KUE_PORT: process.env.KUE_PORT
	},
	session: {
		secretString: process.env.SESSION_SECRET
	},
	url: {
		API_BASE_URL: process.env.API_BASE_URL,
		CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
		CORS_ORIGIN: process.env.CORS_ORIGIN
	}
};