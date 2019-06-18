const randomstring = require('randomstring');
const sanitize = require('mongo-sanitize');
const signale = require('signale');
const validator = require('validator');

// Importing config/env variables
const config = require('../../config/config');

// Importing models
const Student = require('../../models/student.model');

// Importing utils
const passwordUtil = require('../../utils/password.util');
const registerUtil = require('../../utils/register.util');
const sendgridMailUtil = require('../../utils/sendgridMail.util');

exports.sendVerificationCode = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email)){
            throw Error('Invalid parameters');
        }
        const email = sanitize(req.body.email);
        const studentExists = await Student.findOne({email: email}).exec();
        if(studentExists){
            throw Error('Email already exists!');
        }
        let student = new Student();
        student.email = email;
        student.verificationCode = randomstring.generate(6);
        student.isVerified1 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.email,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }
        
        let newStudent = await student.save();
        
        return res.json({
            status_code: 200,
            message: `An email with verification code has been sent to your email: ${newStudent.email}`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.reSendVerificationCode = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email)){
            throw Error('Invalid parameters');
        }
        const email = req.body.email;
        const student = await Student.findOne({email: email}).exec();
        if(!student){
            throw Error('Sorry, this email is not registered. Please register with your email first.');
        }
        student.verificationCode = randomstring.generate(6);
        student.isVerified1 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.email,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }
        
        let newStudent = await student.save();
        
        return res.json({
            status_code: 200,
            message: `An email with new verification code has been sent to your email: ${newStudent.email}`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.checkVerificationCode = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email) || !req.body.verificationCode){
            throw Error('Invalid parameters');
        }

        const email = req.body.email;
        const verificationCode = req.body.verificationCode;
        const student = await Student.findOne({
            email: email, 
            verificationCode: verificationCode
        }).exec();
        if(!student){
            throw Error('Please check your email and verification code.');
        }

        res.status(200).json({
            status_code: 200,
            message: 'Success'
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.sendInstiVerificationCode = async (req, res) => {
    try{
        if(!req.body.instiEmail || !validator.isEmail(req.body.instiEmail)){
            throw Error('Invalid parameters');
        }

        const email = req.session.student.email;
        const instiEmail = sanitize(req.body.instiEmail);
        const instiEmailExists = await Student.findOne({instiEmail: instiEmail}).exec();
        if(instiEmailExists){
            throw Error('Institute email already exists!');
        }

        let student = await Student.findOne({email: email}).exec();
        student.instiEmail = instiEmail;
        student.verificationCode = randomstring.generate(6);
        student.isVerified2 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.instiEmail,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }

        let newStudent = await student.save();
        
        return res.json({
            status_code: 200,
            message: `An email with verification code has been sent to your email: ${newStudent.instiEmail}`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.reSendInstiVerificationCode = async (req, res) => {
    try{
        if(!req.body.instiEmail || !validator.isEmail(req.body.instiEmail)){
            throw Error('Invalid parameters');
        }

        const email = req.session.student.email;
        const instiEmail = req.body.instiEmail;
        const student = await Student.findOne({
            email: email, 
            instiEmail: instiEmail
        }).exec();
        if(!student){
            throw Error('Sorry, this email is not registered.');
        }

        student.verificationCode = randomstring.generate(6);
        student.isVerified2 = false;
        
        let mailResponse = await sendgridMailUtil.sendVerificationCode(student.instiEmail,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }

        let newStudent = await student.save();
        
        return res.json({
            status_code: 200,
            message: `An email with new verification code has been sent to your email: ${newStudent.instiEmail}`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.verifyInstiEmail = async (req, res) => {
    try{
        if(!req.body.instiEmail || !validator.isEmail(req.body.instiEmail) || !req.body.verificationCode){
            throw Error('Invalid parameters');
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
            throw Error('Please check your email and verification code.');
        }
        
        student.isVerified2 = true;
        // Changing verification code after verification
        student.verificationCode = randomstring.generate(6);
        await student.save();
        
        res.status(200).json({
            status_code: 200,
            message: 'Success'
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        if(!req.body.email || !validator.isEmail(req.body.email)){
            throw Error('Invalid parameters');
        }
        const email = req.body.email;
        let student = await Student.findOne({email: email}).exec();
        if(!student){
            throw Error(`Email doesn't exists!`);
        }
        student.verificationCode = randomstring.generate(6);
        
        let mailResponse = await sendgridMailUtil.sendPasswordVerificationCode(student.email,student.verificationCode);
        if(mailResponse.status_code!=200){
            throw Error(mailResponse.message);
        }
        
        await student.save();
        
        return res.json({
            status_code: 200,
            message: `An email with verification code has been sent to your email: ${student.email}`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.resetPassword = async (req, res) => {
    try{
        if(!req.body.email || !req.body.verificationCode || !req.body.password || !req.body.confirmPassword || !validator.isEmail(req.body.email)){
            throw Error('Invalid parameters');
        }
        const email = req.body.email;
        let student = await Student.findOne({email: email, verificationCode: req.body.verificationCode}).exec();
        if(!student){
            throw Error(`Please check your email and verification code.`);
        }

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        
        if( !(password==confirmPassword) || (password.length<8) )
            throw Error('Password Mismatch or Invalid password.');

        password = await passwordUtil.hashPassword(password);
        student.password = password;
        // Changing verification code after changing password
        student.verificationCode = randomstring.generate(6);
        
        await student.save();
        
        return res.json({
            status_code: 200,
            message: `Password successfully reset.`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.registerStudent = async (req, res) => {
    try{
        if(!registerUtil.checkEmptyInput(req)){
            throw Error('Invalid parameters');
        }

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        
        if( !(password==confirmPassword) || (password.length<8) )
            throw Error('Password Mismatch or Invalid password.');
        
        const student = await Student.findOne({
            email: req.body.email, 
            verificationCode: req.body.verificationCode,
            isVerified1: false
        }).exec();
        if(!student){
            throw Error('Please check your email and verification code.');
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
        
        return res.json({
            status_code: 200,
            message: `User with email: ${newStudent.email} successfully registered.`
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.loginStudent = async (req, res) => {
    try{
        if(!req.body.email || !req.body.password || !validator.isEmail(req.body.email)){
            throw Error('Invalid Parameters');
        }

        const email = req.body.email;
        const password = req.body.password;
        const student = await Student.findOne({
            email: email, 
            isVerified1: true
        }).exec();
        if(!student){
            throw Error('Please check your email, user account does not exists.');
        }

        let isAuthenticatedUser = await passwordUtil.comparePassword(password, student.password);

        if(isAuthenticatedUser){
            req.session.student = {
                email: student.email
            }
            return res.status(200).json({
                status_code: 200,
                message: 'Successfully, logged in to your account.'
            });
        }
        else{
            return res.status(400).json({
                status_code: 400,
                message: 'Username or Password is incorrect.'
            });
        }

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.logoutStudent = async (req, res) => {
    try{
        let logout = req.session.destroy();
        return res.status(200).json({
            status_code: 200,
            message: 'Successfully, logged out of your account.'
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}