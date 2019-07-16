const HttpStatus = require('http-status-codes');
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
        let status_code = 401;
        return res.status(status_code).json({
            status_code: status_code,
            message: 'Unauthorised access',
            data: {}
        });
    } catch(error) {
        logger.error(error.toString());
        let status_code = 500;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
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
            let status_code = 401;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        let student = await Student.findOne({email: email}).exec();
        if(!student || !student.isVerified1){
            return next();
        }

        logger.info(`Primary email already verified for email: ${email}`);
        let status_code = 400;
        return res.status(status_code).json({
            status_code: status_code,
            message: 'Primary email is already verified.',
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

exports.checkInstiVerificationAccess = async(req, res, next) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(student.isVerified1 && !student.isVerified2){
            return next();
        }

        logger.info(`Already verified or Requested resource is blocked for email: ${email}`);
        let status_code = 401;
        return res.status(status_code).json({
            status_code: status_code,
            message: `Can't access the required resource.`,
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

exports.checkAccountActivation = async(req, res, next) => {
    try {
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(student.isVerified1 && student.isVerified2){
            return next();
        }

        logger.info(`Requested resource is blocked for email: ${email}`);
        let status_code = 401;
        return res.status(status_code).json({
            status_code: status_code,
            message: 'Please complete institute email verification',
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