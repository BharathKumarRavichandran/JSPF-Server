const path = require('path');
const winston = require('winston');

// Importing configuration file
const config = require('../config/config');


// Define the custom settings for each transport (file, console)
var transportOptions = {
    infoFile: {
        level: 'info',
        filename: path.join(config.directory.LOGS_DIR, 'info_logs.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: true,
    },
    warnFile: {
        level: 'warn',
        filename: path.join(config.directory.LOGS_DIR, 'warn_logs.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: true,
    },
    errorFile: {
        level: 'error',
        filename: path.join(config.directory.LOGS_DIR, 'error_logs.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: true,
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// Configure different transports based on environment
let transports = new Array();
// Push production/error level transports
transports.push(new winston.transports.File(transportOptions.errorFile));

// Push development level transports
if(config.environment=='development'){
    transports.push(new winston.transports.Console(transportOptions.console));
    transports.push(new winston.transports.File(transportOptions.infoFile));
    transports.push(new winston.transports.File(transportOptions.warnFile));
}


// Setting format of logs
let formats = new Array();
formats.push(winston.format.splat());
formats.push(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}));
formats.push(winston.format.json());

// Instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    format: winston.format.combine.apply(null, formats),
    transports: transports,
    exitOnError: false, // do not exit on handled exceptions
});

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // Use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;