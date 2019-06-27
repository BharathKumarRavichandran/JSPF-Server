const sanitize = require('mongo-sanitize');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

exports.updateInfo = async (req, res) => {
    try{
        if(!req.body.introduction){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }

        const email = req.session.student.email;
        let introduction = sanitize(req.body.introduction);
        introduction = introduction.substr(0,1000);
        const student = await Student.findOne({email: email}).exec();
        student.personalInfo.introduction = introduction;
        await student.save();
        
        logger.info(`Successfully updated student's introduction for email: ${student.email}`);
        return res.status(200).json({
            status_code: 200,
            message: `Successfully updated student's introduction`,
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
