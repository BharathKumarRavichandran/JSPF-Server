const path = require('path');
const randomstring = require('randomstring');
const sanitize = require('mongo-sanitize');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const mentorsUtil = require('../utils/mentors.util');
const Uploader = require('../utils/upload.util');


exports.sendDocLink = async (req, res) => {
    try{
        if(!req.body.docLink){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }

        const email = req.session.student.email;
        let docLink = sanitize(req.body.docLink);
        const student = await Student.findOne({email: email}).exec();
        student.abstract.docLink = docLink;

        let submissionType = 'Project Abstract';
        let mailJobs = await mentorsUtil.createMailJobs(student.personalInfo.name, docLink, submissionType);
        if(mailJobs.status_code!=200){
            throw(mailJobs.message);
        }
        
        await student.save();
        
        logger.info(`Successfully created mailing jobs and saved abstract's doc link for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: `Successfully saved abstract's doc link`,
            data: {}
        });
    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.uploadFinalAbstract = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'projectAbstract';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join('uploads',student.applicationNumber,uploadResponse.data.file.filename);
            student.abstract.projectAbstract = location;
            await student.save();
            logger.info(`Successfully uploaded project abstract for email: ${student.email}`);
        }
        else{
            logger.warn(uploadResponse.message);
        }
                
        return res.status(uploadResponse.status_code).json({
            status_code: uploadResponse.status_code,
            message: uploadResponse.message,
            data: {}
        });

    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.uploadSupportingFiles = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'supportingFiles';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /jpeg|jpg|png|avi|flv|mov|mp4|mkv|wmv/,
        }
        let fieldDetails = {
            fieldName: fieldName,
            maxCount: 2
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadMulti(req,res,fieldDetails);

        if(uploadResponse.status_code==200){
            var locationArray = new Array();
            for(let i=0;i<fieldDetails.maxCount;i++){
                let location = path.join('uploads',student.applicationNumber,uploadResponse.data.files[i].filename);
                locationArray.push(location);
            }
            student.abstract.supportingFiles = locationArray;
            await student.save();
            logger.info(`Successfully uploaded project supporting files for email: ${student.email}`);
        }
        else {
            logger.warn(uploadResponse.message);
        }
        
        return res.status(uploadResponse.status_code).json({
            status_code: uploadResponse.status_code,
            message: uploadResponse.message,
            data: {}
        });

    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.viewAbstract = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('abstract applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved abstract details for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: {
                applicationNumber: student.applicationNumber,
                abstract: student.abstract
            }
        });
    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}