var bcrypt = require('bcryptjs');
var sanitize = require('mongo-sanitize');


exports.hashPassword = async(password) => {
    try {
        password = sanitize(password);
        let salt = await bcrypt.genSaltSync(10);
        let hashedPassword = await bcrypt.hashSync(password, salt);
        return hashedPassword;
    }
    catch(error){
        return false;
    }
}

exports.comparePassword = async(password, hash) => {
    try {
        return bcrypt.compare(password, hash);
    } catch(error){
        return false;
    }
}