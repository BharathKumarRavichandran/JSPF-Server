const path = require('path');
const randomstring = require('randomstring');

// Importing models
const Student = require('../models/student.model');

//Importing utils
const Uploader = require('../utils/upload.util');


exports.uploadDocLink = async (req, res) => {
    try{
        if(!req.body.docLink)
            throw('Invalid parameters');
        const email = req.session.student.email;
        let docLink = sanitize(req.body.docLink);
        const student = await Student.findOne({email: email}).exec();
        student.abstract.docLink = docLink;
        await student.save();
        res.status(200).json({
            status_code: 200,
            message: `Successfully saved abstract's doc link`
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
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

exports.viewAbstract = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('abstract applicationNumber -_id').exec();
        res.status(200).json({
            status_code: 200,
            message: {
                applicationNumber: student.applicationNumber,
                abstract: student.abstract
            }
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}