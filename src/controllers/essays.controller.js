const path = require('path');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const Uploader = require('../utils/upload.util');


exports.uploadSOPToMentors = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'mentorsSOP';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
            student.essays.mentors.sop = location;
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

exports.uploadCommunityToMentors = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'mentorsCommunity';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
            student.essays.mentors.community = location;
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

exports.uploadSocietyToMentors = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'mentorsSociety';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
            student.essays.mentors.society = location;
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

exports.uploadFinalSOP = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        let fieldName = 'finalSOP';
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
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
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
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
        let fileName = student.applicationNumber + '_' + fieldName + '_' + Date.now();
        const fileOptions = {
            fileName: fileName,
            fieldName: fieldName,
            allowedFileSize : 3000000, // 3 MB
            allowedFileTypesRE: /pdf/,
        }
        let fileUploader = new Uploader(req,student.applicationNumber,fileOptions);
        let uploadResponse = await fileUploader.uploadSingle(req,res,fieldName);

        if(uploadResponse.status_code==200){
            let location = path.join(student.applicationNumber,uploadResponse.data.file.filename);
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
        res.status(200).json({
            status_code: 200,
            message: {
                applicationNumber: student.applicationNumber,
                essays: student.essays
            }
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}