const sanitize = require('mongo-sanitize');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

exports.updateInfo = async (req, res) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();

        student.personalInfo.introduction = sanitize(req.body.introduction.substr(0,1000));
        student.personalInfo.gender = sanitize(req.body.gender);
        student.personalInfo.disability.status = sanitize(req.body.disabilityStatus);
        if(req.body.disabilityStatus && req.body.disabilityStatus=='Yes'){
            student.personalInfo.disability.description = sanitize(req.body.disabilityDescription.substr(0,100));
        }
        student.personalInfo.nationality = sanitize(req.body.nationality);
        student.personalInfo.firstGenStudent = sanitize(req.body.firstGenStudent);
        student.personalInfo.refugee = sanitize(req.body.refugee);
        student.personalInfo.pronoun = sanitize(req.body.pronoun);
        
        await student.save();
        
        logger.info(`Successfully updated student's personal information for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: `Successfully updated student's personal information`,
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

exports.getInfo = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('personalInfo applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved personal info for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: {
                applicationNumber: student.applicationNumber,
                personalInfo: student.personalInfo
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
