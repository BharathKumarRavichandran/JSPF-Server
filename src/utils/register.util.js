const validator = require('validator');


exports.checkEmptyInput = (req) => {
    let bool = (
        req.body.email &&
        validator.isEmail(req.body.email) &&
        req.body.verificationCode &&
        req.body.password &&
        req.body.confirmPassword &&
        req.body.name &&
        req.body.rollNumber &&
        req.body.department &&
        req.body.contactNumberCall &&
        req.body.contactNumberWhatsapp &&
        req.body.tshirtSize
    );
    return bool;
}

exports.checkEduEmail = (email) => {
    return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$/).test(email);
}

exports.initializeModel = (student) => {
    
}