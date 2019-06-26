const path = require('path');
const randomstring = require('randomstring');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const Uploader = require('../utils/upload.util');


exports.sendSOPToMentors = async (req, res) => {
    try{
        if(!req.body.sopLink)
            throw('Invalid parameters');
        const email = req.session.student.email;
        const sopLink = sanitize(req.body.sopLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.sop = sopLink;
        await student.save();
        
        return res.status(200).json({
            status_code: 200,
            message: 'Success'
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.sendCommunityToMentors = async (req, res) => {
    try{
        if(!req.body.communityLink)
            throw('Invalid parameters');
        const email = req.session.student.email;
        const communityLink = sanitize(req.body.communityLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.community = communityLink;
        await student.save();
        
        return res.status(200).json({
            status_code: 200,
            message: 'Success'
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.sendSocietyToMentors = async (req, res) => {
    try{
        if(!req.body.societyLink)
            throw('Invalid parameters');
        const email = req.session.student.email;
        const societyLink = sanitize(req.body.societyLink);
        let student = await Student.findOne({email: email}).exec();
        student.essays.mentors.society = societyLink;
        await student.save();
        
        return res.status(200).json({
            status_code: 200,
            message: 'Success'
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
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
        }
        
        return res.status(uploadResponse.status_code).json({
            status_code: uploadResponse.status_code,
            message: uploadResponse.message
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
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
        }
        
        return res.status(uploadResponse.status_code).json({
            status_code: uploadResponse.status_code,
            message: uploadResponse.message
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
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
        }
        
        return res.status(uploadResponse.status_code).json({
            status_code: uploadResponse.status_code,
            message: uploadResponse.message
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.viewFinalEssays = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('essays applicationNumber -_id').exec();
        return res.status(200).json({
            status_code: 200,
            message: {
                applicationNumber: student.applicationNumber,
                essays: student.essays
            }
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}