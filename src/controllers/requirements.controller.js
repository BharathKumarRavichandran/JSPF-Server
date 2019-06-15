// Importing models
const Student = require('../models/student.model');

// Importing utils
const requirementsUtil = require('../utils/requirements.util');

exports.getAllPendingRequirements = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const allPendingRequirements = requirementsUtil.getAllPendingRequirements(student);
        res.status(200).json({
            status_code: 200,
            message: allPendingRequirements
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.getNecessaryPendingRequirements = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const necessaryPendingRequirements = requirementsUtil.getNecessaryPendingRequirements(student);
        res.status(200).json({
            status_code: 200,
            message: necessaryPendingRequirements
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}
