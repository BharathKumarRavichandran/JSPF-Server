const validator = require('validator');

// Importing config/env variables
const logger = require('../../config/winston');

// Importing models
const Student = require('../../models/student.model');

exports.checkStudentSession = (req, res, next) => {
    try{
        if (req.session.student && req.session.student.email) {
            return next();
        } 

        logger.info('Unauthorised access');
        return res.status(400).json({
            status_code: 400,
            message: 'Unauthorised access',
            data: {}
        });
    } catch(error) {
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.checkAccountInactivation = async(req, res, next) => {
    try {
        
        let email = null;
        
        if(req.method=='GET')
            email = req.query.email;
        else if(req.method=='POST')
            email = req.body.email;
   
        if(!email || !validator.isEmail(email)){
            logger.warn('Invalid parameters');
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid parameters',
                data: {}
            });
        }
        let student = await Student.findOne({email: email}).exec();
        if(!student || !student.isVerified1){
            return next();
        }

        logger.info(`Primary email already verified for email: ${email}`);
        return res.status(400).json({
            status_code: 400,
            message: 'Primary email is already verified.',
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

exports.checkInstiVerificationAccess = async(req, res, next) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(student.isVerified1 && !student.isVerified2){
            return next();
        }

        logger.info(`Already verified or Requested resource is blocked for email: ${email}`);
        return res.status(400).json({
            status_code: 400,
            message: `Can't access the required resource.`,
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

exports.checkAccountActivation = async(req, res, next) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(student.isVerified1 && student.isVerified2){
            return next();
        }

        logger.info(`Requested resource is blocked for email: ${email}`);
        return res.status(400).json({
            status_code: 400,
            message: 'Please complete institute email verification',
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