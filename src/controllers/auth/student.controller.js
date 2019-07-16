const HttpStatus = require('http-status-codes');
const mkdirp = require('mkdirp');
const path = require('path');
const randomstring = require('randomstring');
const sanitize = require('mongo-sanitize');
const validator = require('validator');

// Importing config/env variables
const config = require('../../config/config');
const logger = require('../../config/winston');

// Importing models
const Student = require('../../models/student.model');

// Importing utils
const passwordUtil = require('../../utils/password.util');
const registerUtil = require('../../utils/register.util');
const sendgridMailUtil = require('../../utils/sendgridMail.util');

exports.sendVerificationCode = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        const email = sanitize(req.body.email);
        let student = await Student.findOne({email: email}).exec();
        
        // If student with email does not exist
        if(!student){
            student = new Student();
            student.email = email;
        }

        student.verificationCode = randomstring.generate(6);
        student.isVerified1 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.email,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }
        
        let newStudent = await student.save();
        
        logger.info(`An email with verification code has been sent to your email: ${newStudent.email}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `An email with verification code has been sent to your email: ${newStudent.email}`,
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

exports.checkVerificationCode = async (req, res) => {
    try{
        if(!req.query.email || !validator.isEmail(req.query.email) || !req.query.verificationCode){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }

        const email = req.query.email;
        const verificationCode = req.query.verificationCode;
        const student = await Student.findOne({
            email: email, 
            verificationCode: verificationCode
        }).exec();
        if(!student){
            logger.warn(`Please check your email: ${email} and verification code.`);
            return res.status(400).json({
                status_code: 400,
                message: 'Please check your email and verification code.',
                data: {}
            });
        }

        logger.info(`Email verification code success for email: ${student.email}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
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

exports.sendInstiVerificationCode = async (req, res) => {
    try{
        if(!req.body.instiEmail || !validator.isEmail(req.body.instiEmail)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        if(!registerUtil.checkEduEmail(req.body.instiEmail)){
            logger.warn(`Please enter a valid institute(.edu) email address : ${req.body.instiEmail}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please enter a valid institute(.edu) email address',
                data: {}
            });
        }

        const email = req.session.student.email;
        const instiEmail = sanitize(req.body.instiEmail);
        let student = await Student.findOne({email: email}).exec();

        student.instiEmail = instiEmail;
        student.verificationCode = randomstring.generate(6);
        student.isVerified2 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.instiEmail,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }

        let newStudent = await student.save();
        
        logger.info(`An email with verification code has been sent to your email: ${newStudent.instiEmail}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `An email with verification code has been sent to your email: ${newStudent.instiEmail}`,
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

exports.verifyInstiEmail = async (req, res) => {
    try{
        if(!req.body.instiEmail || !validator.isEmail(req.body.instiEmail) || !req.body.verificationCode){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        if(!registerUtil.checkEduEmail(req.body.instiEmail)){
            logger.warn(`Please enter a valid institute(.edu) email address : ${req.body.instiEmail}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please enter a valid institute(.edu) email address',
                data: {}
            });
        }

        const email = req.session.student.email;
        const instiEmail = req.body.instiEmail;
        const verificationCode = req.body.verificationCode;
        const student = await Student.findOne({
            email: email, 
            instiEmail: instiEmail,
            verificationCode: verificationCode,
            isVerified2: false
        }).exec();
        if(!student){
            logger.warn(`Please check your email: ${email} and verification code.`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please check your email and verification code.',
                data: {}
            });
        }

        // Creating directory for the student
        await mkdirp(path.join(config.directory.UPLOADS_DIR,student.applicationNumber));
        
        student.isVerified2 = true;
        // Changing verification code after verification
        student.verificationCode = randomstring.generate(6);
        await student.save();

        logger.info(`Institute email successfully verified : ${student.instiEmail}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
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

exports.forgotPassword = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        const email = req.body.email;
        let student = await Student.findOne({email: email}).exec();
        if(!student){
            logger.warn(`Email doesn't exists: ${email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: `Email doesn't exists!`,
                data: {}
            });
        }
        student.verificationCode = randomstring.generate(6);
        
        let mailResponse = await sendgridMailUtil.sendPasswordVerificationCode(student.email,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }
        
        await student.save();
        
        logger.info(`An email with verification code has been sent to email: ${student.email}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `An email with verification code has been sent to your email: ${student.email}`,
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

exports.resetPassword = async (req, res) => {
    try{
        if(!req.body.email || !req.body.verificationCode || !req.body.password || !req.body.confirmPassword || !validator.isEmail(req.body.email)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }
        const email = req.body.email;
        let student = await Student.findOne({email: email, verificationCode: req.body.verificationCode}).exec();
        if(!student){
            logger.warn(`Please check your email: ${email} and verification code.`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please check your email and verification code.',
                data: {}
            });
        }

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        
        if( !(password==confirmPassword) || (password.length<8) ){
            logger.warn(`Password Mismatch or Invalid password: ${email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Password Mismatch or Invalid password.',
                data: {}
            });
        }

        if(!passwordUtil.checkPasswordRule(password)){
            logger.warn(`Password rule not passed for email: ${student.email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Password must be atleast 8 characters in length and should contain 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.',
                data: {}
            });
        }

        password = await passwordUtil.hashPassword(password);
        student.password = password;
        // Changing verification code after changing password
        student.verificationCode = randomstring.generate(6);
        
        await student.save();
        
        logger.info(`Password successfully reset for email: ${student.email}`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `Password successfully reset.`,
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

exports.registerStudent = async (req, res) => {
    try{
        if(!registerUtil.checkEmptyInput(req)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        
        if( !(password==confirmPassword) || (password.length<8) ){
            logger.warn(`Password Mismatch or Invalid password: ${email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Password Mismatch or Invalid password.',
                data: {}
            });
        }
        
        if(!passwordUtil.checkPasswordRule(password)){
            logger.warn(`Password rule not passed for email: ${student.email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Password must be atleast 8 characters in length and should contain 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.',
                data: {}
            });
        }

        const student = await Student.findOne({
            email: req.body.email, 
            verificationCode: req.body.verificationCode,
            isVerified1: false
        }).exec();
        if(!student){
            logger.warn(`Please check your email: ${email} and verification code.`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please check your email and verification code.',
                data: {}
            });
        }

        password = await passwordUtil.hashPassword(password);
        student.password = password;
        student.isVerified1 = true;
        // Changing verification code after verification
        student.verificationCode = randomstring.generate(6);
        student.personalInfo = {
            name: sanitize(req.body.name),
            rollNumber: sanitize(req.body.rollNumber),
            department: sanitize(req.body.department),
            contactNumberCall: sanitize(req.body.contactNumberCall),
            contactNumberWhatsapp: sanitize(req.body.contactNumberWhatsapp),
            tshirtSize: sanitize(req.body.tshirtSize),
            introduction : ""
        }
        // Generating application number
        let applicationNumber = `JSPF${config.date.START_YEAR.slice(-2)}${config.date.END_YEAR.slice(-2)}`;
        applicationNumber += `${Math.floor(Math.random() * 90 + 10)}`; // Adding a random two digit number
        applicationNumber += `${student.personalInfo.rollNumber.slice(-2)}${student.personalInfo.contactNumberCall.slice(-4)}`;
        student.applicationNumber = applicationNumber;

        let newStudent = await student.save();
        
        logger.info(`User with email: ${newStudent.email} successfully registered.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: `User with email: ${newStudent.email} successfully registered.`,
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

exports.loginStudent = async (req, res) => {
    try{
        if(!req.body.email || !req.body.password || !validator.isEmail(req.body.email)){
            logger.warn('Invalid parameters');
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            });
        }

        const email = req.body.email;
        const password = req.body.password;
        const student = await Student.findOne({
            email: email, 
            isVerified1: true
        }).exec();
        if(!student){
            logger.warn(`Please check your email ${email}, user account does not exists.`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Please check your email, user account does not exists.',
                data: {}
            });
        }

        let isAuthenticatedUser = await passwordUtil.comparePassword(password, student.password);

        if(isAuthenticatedUser){
            req.session.student = {
                email: student.email
            }

            logger.info(`User with email: ${student.email} successfully logged in.`);
            let status_code = 200;
            return res.status(status_code).json({
                status_code: status_code,
                message: 'Successfully, logged in to your account.',
                data: {}
            });
        }
        else{
            logger.warn(`Username or Password is incorrect for email: ${email}`);
            let status_code = 400;
            return res.status(status_code).json({
                status_code: status_code,
                message: `Username or Password is incorrect`,
                data: {}
            });
        }

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

exports.logoutStudent = async (req, res) => {
    try{
        let logout = req.session.destroy();

        logger.info(`User successfully logged out.`);
        let status_code = 200;
        return res.status(status_code).json({
            status_code: status_code,
            message: 'Successfully, logged out of your account.',
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