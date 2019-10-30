const HttpStatus = require('http-status-codes');

// Importing config/env variables
const logger = require('../config/winston');

// Importing models
const Student = require('../models/student.model');

// Importing utils
const requirementsUtil = require('../utils/requirements.util');

exports.getAllPendingRequirements = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const allPendingRequirements = requirementsUtil.getAllPendingRequirements(student);
        
        logger.info(`Successfully retrieved all pending requirements for email: ${student.email}.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: allPendingRequirements
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

exports.getNecessaryPendingRequirements = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const necessaryPendingRequirements = requirementsUtil.getNecessaryPendingRequirements(student);
        
        logger.info(`Successfully retrieved all pending requirements for email: ${student.email}.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: necessaryPendingRequirements
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
