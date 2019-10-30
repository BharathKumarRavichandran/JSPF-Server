const fs = require('fs');
const HttpStatus = require('http-status-codes');
const kue = require('kue');
const logger = require('../config/winston');

// Importing configuration/env variables
const config = require('../config/config');

// Connections
const queue = kue.createQueue({
    prefix: 'q',
    redis: {
        port: config.redis.PORT,
        host: config.redis.HOST
    }
});

exports.createMailJobs = async (studentName, docLink, submissionType) => {
    try {
        const MENTORS_LIST_PATH = config.files.mentorsList;
        const fileContent = await fs.readFileSync(MENTORS_LIST_PATH,'utf8');
        const mentorsList = JSON.parse(fileContent);

        // Create mailMentor jobs for each mentors
        for(let i=0;i<mentorsList.length;i++){ 
            
            await queue.create('mailMentor', {
                mentorEmail: mentorsList[i].email,
                studentName: studentName,
                docLink: docLink,
                submissionType: submissionType
            })
            .removeOnComplete(true)
            .attempts(5)
            .backoff({type: 'exponential'})
            .save();

        }
        logger.info(`Added mentor email jobs for student: ${studentName}`);
        let status_code = 200;       
        return {
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        }
    } catch(error){
        logger.error(error.toString());
        let status_code = 500;
        return {
            status_code: status_code,
            message: error.toString(),
            data: {}
        }
    }
}