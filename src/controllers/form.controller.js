// Importing models
const Student = require('../models/student.model');

// Importing utils
const formUtil = require('../utils/form.util');

exports.previewForm = async (req, res, next) => {

}

exports.submitForm = async (req, res, next) => {
    try{
        const email = req.session.student.email;
        let student = await Student.findOne({email: email}).exec();
        if(!formUtil.checkFormSubmission(student))
            throw('Please fill all required fields to submit form.');
        student.isSubmitted = true;
        await student.save();
        res.status(200).json({
            status_code: 200,
            message: `Successfully submitted form.`
        });
    } catch(error){
        res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}
