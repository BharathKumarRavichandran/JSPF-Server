const kue = require('kue');
const queue = kue.createQueue();
const path = require('path');
const randomstring = require('randomstring');

// Importing config/env variables
const config = require('../config/config');

// Importing models
const Student = require('../models/student.model');

// Importing utils
const formUtil = require('../utils/form.util');
const pdfUtil = require('../utils/pdf.util');


exports.viewApplication = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(!formUtil.checkFormSubmission(student))
            throw('Please fill all required fields to view application form.');

        // Add file paths to generate personal information pdf
        const ejsPath = path.join(config.directory.SRC_DIR,'templates','pdfs','personalInfo.ejs');
        const personalInfoFileName = student.applicationNumber + '_personalInfo_' + randomstring.generate(4) + '_' + Date.now() + '.pdf';
        const destinationFilePath = path.join(config.directory.UPLOADS_DIR,student.applicationNumber,personalInfoFileName);
        
        // Generate pdf with personal information, certificates and grade sheets
        let genPdfResponse = await pdfUtil.generatePdf(student,ejsPath,destinationFilePath);
        if(genPdfResponse.status_code!=200){
            return res.status(genPdfResponse.status_code).json({
                status_code: genPdfResponse.status_code,
                message: genPdfResponse.message
            });
        }

        const personalInfoFilePath = path.join('uploads',student.applicationNumber,personalInfoFileName);
        student.personalInfo.filePath = personalInfoFilePath;
        student = await student.save();

        // Add file paths to merge all pdfs to create student application
        const filesResponse = await formUtil.returnFilesLocationAsArray(student);
        const applicationFileName = student.applicationNumber + '_application_' + randomstring.generate(4) + '_' + Date.now() + '.pdf';
        const applicationRelativePath = path.join('uploads',student.applicationNumber,applicationFileName);  
        const applicationDestinationPath = path.join(config.directory.UPLOADS_DIR,student.applicationNumber,applicationFileName);

        // Merge all pdfs to create student application
        const mergeResponse = await pdfUtil.mergePdf(filesResponse.data.filesPathArray,applicationDestinationPath);
        
        if(mergeResponse.status_code!=200){
            return res.status(mergeResponse.status_code).json({
                status_code: mergeResponse.status_code,
                message: mergeResponse.message
            });
        }
        student.applicationFilePath = applicationRelativePath;
        let newStudent = await student.save();

        return res.status(200).json({
            status_code: 200,
            message: `Success`,
            data: {
                applicationFilePath: newStudent.applicationFilePath
            }
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.submitForm = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        
        if(!formUtil.checkFormSubmission(student))
            throw('Please fill all required fields to submit form.');
        
        if(student.isSubmitted)
            throw('Already submitted form.');
        
        let summaryArchiveFileName = student.applicationNumber + '_summary_' + Date.now() + '.' + config.files.archive.format;
        let summaryArchiveFilePath = path.join('uploads',student.applicationNumber,summaryArchiveFileName);

        let finalArchiveFileName = student.applicationNumber + '_final_' + Date.now() + '.' + config.files.archive.format;
        let finalArchiveFilePath = path.join('uploads',student.applicationNumber,finalArchiveFileName);

        student.archive.summary = summaryArchiveFilePath;
        student.archive.final = finalArchiveFilePath;
        await student.save();

        student = await Student.findOne({email: email}).select('-_id -__v -verificationCode -isVerified1 -isVerified2 -password -createdAt -updatedAt').exec();
    
        // Archive summary application and attach to mail
        let summaryArchiveJob = await queue.create('archiveSummary', {
            student: JSON.stringify(student.toJSON())
        })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({type: 'exponential'})
        .save();
        summaryArchiveJob.log(`${student.email}: Archive summary application job added to job queue.`);

        // Archive final application and upload to google drive
        let finalArchiveJob = await queue.create('archiveFinal', {
            student: JSON.stringify(student.toJSON())
        })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({type: 'exponential'})
        .save();
        finalArchiveJob.log(`${student.email}: Archive final files job added to queue.`);
        
        student.isSubmitted = true;
        await student.save();

        return res.status(200).json({
            status_code: 200,
            message: `Successfully submitted form.`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}
