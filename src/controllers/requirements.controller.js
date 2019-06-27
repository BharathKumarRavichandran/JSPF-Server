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
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: allPendingRequirements
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

exports.getNecessaryPendingRequirements = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const necessaryPendingRequirements = requirementsUtil.getNecessaryPendingRequirements(student);
        
        logger.info(`Successfully retrieved all pending requirements for email: ${student.email}.`);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: necessaryPendingRequirements
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
