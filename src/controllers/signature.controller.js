const sanitize = require('mongo-sanitize');
const validator = require('validator');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

exports.updateSignature = async (req, res, next) => {
    try{
        if(!req.body.signature || validator.isEmpty(req.body.signature)){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }
        
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        student.signature = sanitize(req.body.signature);
        await student.save();
        
        logger.info(`Successfully updated signature for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: `Successfully updated signature.`,
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

exports.getSignature = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).select('signature applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved signature for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: {
                applicationNumber: student.applicationNumber,
                signature: student.signature
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