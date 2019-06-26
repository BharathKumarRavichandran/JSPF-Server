// Importing models
const Student = require('../models/student.model');

// Importing utils
const requirementsUtil = require('../utils/requirements.util');

exports.getAllPendingRequirements = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).exec();
        const allPendingRequirements = requirementsUtil.getAllPendingRequirements(student);
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: allPendingRequirements
        });
    } catch(error){
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
        return res.status(200).json({
            status_code: 200,
            message: 'Success',
            data: necessaryPendingRequirements
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}
