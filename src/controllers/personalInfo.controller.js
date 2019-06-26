const sanitize = require('mongo-sanitize');

// Importing models
const Student = require('../models/student.model');

exports.updateInfo = async (req, res) => {
    try{
        if(!req.body.introduction)
            throw('Invalid parameters');
        const email = req.session.student.email;
        let introduction = sanitize(req.body.introduction);
        introduction = introduction.substr(0,1000);
        const student = await Student.findOne({email: email}).exec();
        student.personalInfo.introduction = introduction;
        await student.save();
        return res.status(200).json({
            status_code: 200,
            message: `Successfully updated student's introduction`
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}

exports.getInfo = async (req, res) => {
    try{
        const email = req.session.student.email;
        const student = await Student.findOne({email: email}).select('personalInfo applicationNumber -_id').exec();
        return res.status(200).json({
            status_code: 200,
            message: {
                applicationNumber: student.applicationNumber,
                personalInfo: student.personalInfo
            }
        });
    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString()
        });
    }
}
