const fs = require('fs');
const kue = require('kue');
const queue = kue.createQueue();
const logger = require('../config/winston');

// Importing configuration/env variables
const config = require('../config/config');


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
        return {
            status_code: 200,
            message: `Success`,
            data: {}
        }
    } catch(error){
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}