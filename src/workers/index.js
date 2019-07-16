const kue = require('kue');
const path = require('path');
const queue = kue.createQueue();

// Importing config/env variables
const config = require('../config/config');
const logger = require('../config/winston');

// Importing utils
const archiveUtil = require('../utils/archive.util');
const googleDriveUtil = require('../utils/googleDrive.util');
const sendgridMailUtil = require('../utils/sendgridMail.util');


queue.on('error', (err) => {
    logger.error(error.toString());
});

queue.process('mailMentor', async (job, done)=>{
    try {
        let mentorEmail = job.data.mentorEmail;
        let studentName = job.data.studentName;
        let docLink = job.data.docLink;
        let submissionType = job.data.submissionType;

        let mailResponse = await sendgridMailUtil.sendEmailToMentors(mentorEmail,studentName,docLink,submissionType);
        if(mailResponse.status_code!=200){
            logger.error(mailResponse.message);
            done(new Error(mailResponse.message));
        }

        logger.info(`Successfully mailed to mentor ${mentorEmail} for student: ${studentName}`);
        done();

    } catch(error) {
        logger.error(error.toString());
        done(new Error(error));
    }
});

queue.process('archiveSummary', async (job, done)=>{
    try {
        let student = JSON.parse(job.data.student);
        let archiveResponse = await archiveUtil.archiveSummary(student);
        if(archiveResponse.status_code!=200){
            logger.error(archiveResponse.message);
            done(new Error(archiveResponse.message));
        }
        
        // Mail summary application to student
        let mailJob = await queue.create('mailSummary', {
            email: student.email,
            archiveFilePath: path.join(config.directory.PUBLIC_DIR,student.archive.summary)
        })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({type: 'exponential'})
        .save();
        mailJob.log(`${student.email}: Mail summary application job added to job queue.`);
        logger.info(`${student.email}: Mail summary application job added to job queue.`);

        logger.info(`${student.email}: Summary application successfully archived.`);
        done();

    } catch(error) {
        logger.error(error.toString());
        done(new Error(error));
    }
});
  
queue.process('archiveFinal', async (job, done)=>{
    try {
        let student = JSON.parse(job.data.student);
        let archiveResponse = await archiveUtil.archiveAllFinal(student);
        if(archiveResponse.status_code!=200){
            logger.error(archiveResponse.message);
            done(new Error(archiveResponse.message));
        }
        
        // Upload all final files to google drive
        let uploadJob = await queue.create('driveUploadFinal', {
            email: student.email,
            finalArchivePath: path.join(config.directory.PUBLIC_DIR,student.archive.final)
        })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({type: 'exponential'})
        .save();
        uploadJob.log(`${student.email}: Upload final files to google drive job added to job queue.`);
        logger.info(`${student.email}: Upload final files to google drive job added to job queue.`);

        logger.info(`${student.email}: Final application successfully archived.`);
        done();       
    } catch(error) {
        logger.error(error.toString());
        done(new Error(error));
    }
});

queue.process('mailSummary', async (job, done)=>{
    try {
        let email = job.data.email;
        let archiveFilePath = job.data.archiveFilePath;

        let mailResponse = await sendgridMailUtil.sendApplicationSummary(email,archiveFilePath);
        if(mailResponse.status_code!=200){
            logger.error(mailResponse.message);
            done(new Error(mailResponse.message));
        }

        logger.info(`${email}: Summary application successfully mailed.`);
        done();

    } catch(error) {
        logger.error(error.toString());
        done(new Error(error));
    }
});

queue.process('driveUploadFinal', async (job, done)=>{
    try {
        let email = job.data.email;
        let finalArchivePath = job.data.finalArchivePath;

        let uploadResponse = await googleDriveUtil.uploadFinalApplication(finalArchivePath);
        if(uploadResponse.status_code!=200){
            logger.error(uploadResponse.message);
            done(new Error(uploadResponse.message));
        }

        logger.info(`${email}: Final application successfully uploaded to google drive.`);
        done();

    } catch(error) {
        logger.error(error.toString());
        done(new Error(error));
    }
});