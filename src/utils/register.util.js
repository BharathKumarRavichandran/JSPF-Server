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