// Importing config/env variables
const config = require('../config/config');

exports.sendToMentorsDeadline = async (req, res, next) => {
    try {
        const deadline = new Date(`${config.date.END_DATE_JS}`);
        const gap = deadline.getDate()-5;
        const dateNow = new Date();
        
        if(dateNow < gap){
            return next();
        }

        return res.status(400).json({
            status_code: 400,
            message: `Sorry, can't send to mentors now.`,
            data: {}
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.finalProjectDeadline = async (req, res, next) => {
    try {
        const deadline = new Date(`${config.date.END_DATE_JS}`);
        const gap = deadline.getDate()-30;
        const dateNow = new Date();
        
        if(dateNow > gap){
            return next();
        }

        return res.status(400).json({
            status_code: 400,
            message: 'Sorry, project can be uploaded only 30 days before deadline.',
            data: {}
        });

    } catch(error){
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}