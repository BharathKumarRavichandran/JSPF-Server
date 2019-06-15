// Importing models
const Student = require('../models/student.model');

exports.uploadCertificate = async (req, res) => {
    try{
        
        return res.status(200).json({
            status_code: 200,
            message: `Successfully uploaded file.`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.viewCertificates = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('certificates -_id').exec();
        return res.status(200).json({
            status_code: 200,
            message: student.certificates
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}