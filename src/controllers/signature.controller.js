const HttpStatus = require('http-status-codes');

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
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        student.signature = sanitize(req.body.signature);
        await student.save();
        
        logger.info(`Successfully updated signature for email: ${student.email}.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `Successfully updated signature.`,
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

exports.getSignature = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).select('signature applicationNumber -_id').exec();
        
        logger.info(`Successfully retrieved signature for email: ${student.email}.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {
                applicationNumber: student.applicationNumber,
                signature: student.signature
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