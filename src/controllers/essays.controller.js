const path = require('path');
const sanitize = require('mongo-sanitize');
const randomstring = require('randomstring');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const mentorsUtil = require('../utils/mentors.util');
const Uploader = require('../utils/upload.util');


exports.sendSOPToMentors = async (req, res) => {
    try{
        if(!req.body.sopLink){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }
        const email = req.session.student.email;
        const sopLink = sanitize(req.body.sopLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.sop = sopLink;

        let submissionType = 'Statement of purpose';
        let mailJobs = await mentorsUtil.createMailJobs(student.personalInfo.name, sopLink, submissionType);
        if(mailJobs.status_code!=200){
            throw(mailJobs.message);
        }

        await student.save();
        
        logger.info(`Successfully created mailing jobs and saved SOP link for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
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

exports.sendCommunityToMentors = async (req, res) => {
    try{
        if(!req.body.communityLink){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }

        const email = req.session.student.email;
        const communityLink = sanitize(req.body.communityLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.community = communityLink;
        
        let submissionType = `'For the community' essay`;
        let mailJobs = await mentorsUtil.createMailJobs(student.personalInfo.name, communityLink, submissionType);
        if(mailJobs.status_code!=200){
            throw(mailJobs.message);
        }
        
        await student.save();
        
        logger.info(`Successfully created mailing jobs and saved community essay link for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
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

exports.sendSocietyToMentors = async (req, res) => {
    try{
        if(!req.body.societyLink){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }

        const email = req.session.student.email;
        const societyLink = sanitize(req.body.societyLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.society = societyLink;
        
        let submissionType = `'For the society' essay`;
        let mailJobs = await mentorsUtil.createMailJobs(student.personalInfo.name, societyLink, submissionType);
        if(mailJobs.status_code!=200){
            throw(mailJobs.message);
        }
        
        await student.save();
        
        logger.info(`Successfully created mailing jobs and saved society essay link for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
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

exports.uploadFinalSOP = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'finalSOP';
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
            student.essays.final.sop = location;
            await student.save();
            logger.info(`Successfully uploaded final SOP for email: ${student.email}`);
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

exports.uploadFinalCommunity = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'finalCommunity';
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
            student.essays.final.community = location;
            await student.save();
            logger.info(`Successfully uploaded final community essay for email: ${student.email}`);
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

exports.uploadFinalSociety = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'finalSociety';
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
            student.essays.final.society = location;
            await student.save();
            logger.info(`Successfully uploaded final society essay for email: ${student.email}`);
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

exports.viewFinalEssays = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('essays applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved final essay links/details for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: {
                applicationNumber: student.applicationNumber,
                essays: student.essays
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