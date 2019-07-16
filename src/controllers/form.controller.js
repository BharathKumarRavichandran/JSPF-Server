const HttpStatus = require('http-status-codes');
const kue = require('kue');
const queue = kue.createQueue();
const path = require('path');
const randomstring = require('randomstring');

// Importing config/env variables
const config = require('../config/config');
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

// Importing utils
const formUtil = require('../utils/form.util');
const pdfUtil = require('../utils/pdf.util');


exports.formAccess = async (req, res) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();

        let access = false;
        if(student.isVerified1 && student.isVerified2){
            access = true;
        }

        logger.info(`Form access for ${email}: ${access}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {
                access: access
            }
        });
    } catch(error){
        logger.error(error.toString());
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.getApplicationNumber = async (req, res) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();

        let applicationNumber = student.applicationNumber;

        logger.info(`Application Number for ${email}: ${applicationNumber}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {
                applicationNumber: applicationNumber
            }
        });
    } catch(error){
        logger.error(error.toString());
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.viewApplication = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        
        if(!formUtil.checkFormSubmission(student)){
            logger.warn('Please fill all required fields to submit form.');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: `Please fill all required fields to submit form.`,
                data: {}
            });
        }

        // Add file paths to generate personal information pdf
        const ejsPath = path.join(config.directory.SRC_DIR,'templates','pdfs','personalInfo.ejs');
        const personalInfoFileName = student.applicationNumber + '_personalInfo_' + randomstring.generate(4) + '_' + Date.now() + '.pdf';
        const destinationFilePath = path.join(config.directory.UPLOADS_DIR,student.applicationNumber,personalInfoFileName);
        
        // Generate pdf with personal information, certificates and grade sheets
        let genPdfResponse = await pdfUtil.generatePdf(student,ejsPath,destinationFilePath);
        if(genPdfResponse.status_code!=200){
            logger.error(genPdfResponse.message.toString());
            return res.status(genPdfResponse.status_code).json({
                status_code: genPdfResponse.status_code,
                message: genPdfResponse.message,
                data: {}
            });
        }
        logger.info(`Generated personal info pdf for email: ${student.email}.`);

        const personalInfoFilePath = path.join('uploads',student.applicationNumber,personalInfoFileName);
        student.personalInfo.filePath = personalInfoFilePath;
        student = await student.save();

        // Add file paths to merge all pdfs to create student application
        const filesResponse = await formUtil.returnFilesLocationAsArray(student);
        if(filesResponse.status_code!=200){
            return res.status(filesResponse.status_code).json({
                status_code: filesResponse.status_code,
                message: filesResponse.message,
                data: {}
            });
        }

        const applicationFileName = student.applicationNumber + '_application_' + randomstring.generate(4) + '_' + Date.now() + '.pdf';
        const applicationRelativePath = path.join('uploads',student.applicationNumber,applicationFileName);  
        const applicationDestinationPath = path.join(config.directory.UPLOADS_DIR,student.applicationNumber,applicationFileName);

        // Merge all pdfs to create student application
        const mergeResponse = await pdfUtil.mergePdf(filesResponse.data.filesPathArray,applicationDestinationPath);
        
        if(mergeResponse.status_code!=200){
            return res.status(mergeResponse.status_code).json({
                status_code: mergeResponse.status_code,
                message: mergeResponse.message,
                data: {}
            });
        }
        student.applicationFilePath = applicationRelativePath;
        let newStudent = await student.save();

        logger.info(`Generated merged pdf containing all submitted files for email: ${student.email}.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {
                applicationFilePath: newStudent.applicationFilePath
            }
        });

    } catch(error){
        logger.error(error.toString());
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.submitForm = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        
        if(!formUtil.checkFormSubmission(student)){
            logger.warn('Please fill all required fields to submit form.');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: `Please fill all required fields to submit form.`,
                data: {}
            });
        }
        
        if(student.isSubmitted){
            logger.warn('Already submitted form.');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: `Already submitted form.`,
                data: {}
            });
        }
        
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
        logger.info(`${student.email}: Archive summary application job added to job queue.`);

        // Archive final application and upload to google drive
        let finalArchiveJob = await queue.create('archiveFinal', {
            student: JSON.stringify(student.toJSON())
        })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({type: 'exponential'})
        .save();
        finalArchiveJob.log(`${student.email}: Archive final files job added to queue.`);
        logger.info(`${student.email}: Archive final files job added to queue.`);
        
        student.isSubmitted = true;
        await student.save();

        logger.info(`Successfully submitted form for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: `Successfully submitted form.`,
            data: {}
        });
    } catch(error){
        logger.error(error.toString());
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}
