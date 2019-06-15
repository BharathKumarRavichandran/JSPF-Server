const validator = require('validator');

// Importing models
const Student = require('../../models/student.model');

exports.checkStudentSession = (req, res, next) => {
    try{
        if (req.session.student && req.session.student.email) {
            return next();
        } 
        return res.status(400).json({
            status_code: 400,
            message: 'Unauthorised access'
        });
    } catch(error) {
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.checkAccountInactivation = async(req, res, next) => {
    try {
        if(!req.body.email || !validator.isEmail(req.body.email)){
            throw Error('Invalid parameters');
        }
        const email = req.body.email;
        let student = await Student.findOne({email: email}).exec();
        if(!student || !student.isVerified1){
            return next();
        }
        return res.status(400).json({
            status_code: 400,
            message: 'Primary email is already verified.'
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
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
        return res.status(400).json({
            status_code: 400,
            message: 'Cant access the required resource.'
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
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
        return res.status(400).json({
            status_code: 400,
            message: 'Please complete institute email verification'
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}