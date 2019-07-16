const HttpStatus = require('http-status-codes');
const path = require('path');
const randomstring = require('randomstring');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const Uploader = require('../utils/upload.util');


exports.uploadGradeSheetSem1 = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'gradeSheetSem1';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 1000000, // 1 MB
            allowedFileTypesRE: /jpeg|jpg|png/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join('uploads',student.applicationNumber,uploadResponse.data.file.filename);
            student.certificates.gradeSheetSem1 = location;
            await student.save();
            logger.info(`Successfully uploaded GradeSheetSem1 for email: ${student.email}`);
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
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.uploadInstiCertificate = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'instiCertificate';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 1000000, // 1 MB
            allowedFileTypesRE: /jpeg|jpg|png/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join('uploads',student.applicationNumber,uploadResponse.data.file.filename);
            student.certificates.instiCertificate = location;
            await student.save();
            logger.info(`Successfully uploaded institute certificate for email: ${student.email}`);
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
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.uploadNonInstiCertificate = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'nonInstiCertificate';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 1000000, // 1 MB
            allowedFileTypesRE: /jpeg|jpg|png/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join('uploads',student.applicationNumber,uploadResponse.data.file.filename);
            student.certificates.nonInstiCertificate = location;
            await student.save();
            logger.info(`Successfully uploaded non-institute certificate for email: ${student.email}`);
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
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.uploadGradeSheetMOOC = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'gradeSheetMOOC';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + randomstring.generate(4);
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 1000000, // 1 MB
            allowedFileTypesRE: /jpeg|jpg|png/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join('uploads',student.applicationNumber,uploadResponse.data.file.filename);
            student.certificates.gradeSheetMOOC = location;
            await student.save();
            logger.info(`Successfully uploaded GradeSheetMOOC for email: ${student.email}`);
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
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        });
    }
}

exports.viewCertificates = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('certificates applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved certificate details for email: ${student.email}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {
                applicationNumber: student.applicationNumber,
                certificates: student.certificates
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