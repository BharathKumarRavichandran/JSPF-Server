const path = require('path');


// Declaring globals
const BASE_DIR = __dirname+'/./../../';

require('dotenv').config(
    { 
        path: __dirname+'/./../../.env' 
    },
    { 
        debug: process.env.DEBUG 
    }
)

module.exports = {
	CORS_ORIGIN: process.env.CORS_ORIGIN,
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
	directory: {
		BASE_DIR:  BASE_DIR,
		UPLOADS_DIR: path.join(BASE_DIR,'storage','uploads'),
		LOGS_DIR: path.join(BASE_DIR,'storage','uploads')
	},
	key: {
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
	},
    mongodb: {
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD,
    	DB_URI: process.env.DB_URI
    },
    PORT: process.env.PORT,
    session: {
      secretString: process.env.SESSION_SECRET
	},
	url: {
		API_URL: process.env.API_URL,
		CLIENT_URL: process.env.CLIENT_URL
	}
};