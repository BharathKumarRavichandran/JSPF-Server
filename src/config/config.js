const dotenv = require('dotenv');
const path = require('path');


// Declaring globals
const BASE_DIR = __dirname + '/./../../';

dotenv.config(
	{
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
	debug: process.env.DEBUG.toLowerCase()=='true' ? true : false,
	maintenance: process.env.MAINTENANCE.toLowerCase()=='true' ? true : false,
	directory: {
		BASE_DIR: BASE_DIR,
		CLIENT_BASE_DIR: process.env.CLIENT_BASE_DIR,
		CONFIG_DIR: path.join(BASE_DIR, 'src', 'config'),
		LOGS_DIR: path.join(BASE_DIR, 'storage', 'logs'),
		PUBLIC_DIR: path.join(process.env.CLIENT_BASE_DIR, 'public'),
		SRC_DIR: path.join(BASE_DIR, 'src'),
		APP_STATIC_DIR: path.join(BASE_DIR, 'public'),
		UPLOADS_DIR: path.join(process.env.CLIENT_BASE_DIR, 'public', 'uploads')
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
		DB_HOST: process.env.DB_HOST,
		DB_PORT: process.env.DB_PORT,
		DB_AUTH_ENABLED: process.env.DB_AUTH_ENABLED,
		DB_AUTH_SOURCE: process.env.DB_AUTH_SOURCE,
		DB_NAME: process.env.DB_NAME,
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD
	},
	ports: {
		APP_PORT: process.env.APP_PORT,
		KUE_PORT: process.env.KUE_PORT
	},
	redis: {
		HOST: process.env.REDIS_HOST,
		PORT: process.env.REDIS_PORT
	},
	session: {
		secretString: process.env.SESSION_SECRET
	},
	url: {
		API_BASE_URL: process.env.API_BASE_URL,
		CLIENT_BASE_URL: process.env.CLIENT_BASE_URL
	}
};