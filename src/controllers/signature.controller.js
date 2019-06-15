const sanitize = require('mongo-sanitize');
const validator = require('validator');

// Importing models
const Student = require('../models/student.model');

exports.updateSignature = async (req, res, next) => {
    try{
        if(!req.body.signature || validator.isEmpty(req.body.signature))
            throw('Invalid Parameters');
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        student.signature = sanitize(req.body.signature);
        await student.save();
        return res.status(200).json({
            status_code: 200,
            message: `Successfully updated signature.`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.getSignature = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).select('signature -_id').exec();
        return res.status(200).json({
            status_code: 200,
            message: student
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}