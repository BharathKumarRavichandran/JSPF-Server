const kue = require('kue');
const path = require('path');
const queue = kue.createQueue();

// Importing utils
const archiveUtil = require('../utils/archive.util');
const googleDriveUtil = require('../utils/googleDrive.util');
const sendgridMailUtil = require('../utils/sendgridMail.util');


queue.on('error', (err) => {
    console.log( 'Error in archive worker ', error);
    // log error
});


queue.process('archiveSummary', async (job, done)=>{
    try {
        let student = JSON.parse(job.data.student);
        let archiveResponse = await archiveUtil.archiveSummary(student);
        if(archiveResponse.status_code!=200)
            done(new Error(archiveResponse.message));
        
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

        done();

    } catch(error) {
        done(new Error(error));
    }
});
  
queue.process('archiveFinal', async (job, done)=>{
    try {
        let student = JSON.parse(job.data.student);
        let archiveResponse = await archiveUtil.archiveAllFinal(student);
        if(archiveResponse.status_code!=200)
            done(new Error(archiveResponse.message));
        
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

        done();       
    } catch(error) {
        done(new Error(error));
    }
});

queue.process('mailSummary', async (job, done)=>{
    try {
        let email = job.data.email;
        let archiveFilePath = job.data.archiveFilePath;

        let mailResponse = await sendgridMailUtil.sendApplicationSummary(email,archiveFilePath);
        if(mailResponse.status_code!=200){
            done(new Error(mailResponse.message));
        }

        done();

    } catch(error) {
        done(new Error(error));
    }
});

queue.process('driveUploadFinal', async (job, done)=>{
    try {
        let finalArchivePath = job.data.finalArchivePath;

        let uploadResponse = await googleDriveUtil.uploadFinalApplication(finalArchivePath);
        if(uploadResponse.status_code!=200){
            done(new Error(uploadResponse.message));
        }

        done();

    } catch(error) {
        done(new Error(error));
    }
});