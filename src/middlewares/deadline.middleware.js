// Importing config/env variables
const config = require('../config/config');
const logger = require('../config/winston');


function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(),b.getMonth(),b.getDate(),b.getHours(),b.getMinutes(),b.getSeconds());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


exports.sendToMentorsDeadline = async (req, res, next) => {
    try {
        let deadline = new Date(`${config.date.END_DATE_JS}`);
        deadline.setHours(23);
        deadline.setMinutes(59);
        deadline.setSeconds(59);

        const dateTimeNow = new Date();
        
        const dateDiff = dateDiffInDays(dateTimeNow,deadline);

        if(dateDiff>=5){
            return next();
        }

        logger.info(`Action(send to mentors) is not allowed`);
        return res.status(400).json({
            status_code: 400,
            message: `Sorry, can't send to mentors now.`,
            data: {}
        });

    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}

exports.finalProjectDeadline = async (req, res, next) => {
    try {
        let deadline = new Date(`${config.date.END_DATE_JS}`);
        deadline.setHours(23);
        deadline.setMinutes(59);
        deadline.setSeconds(59);

        const dateTimeNow = new Date();
        
        const dateDiff = dateDiffInDays(dateTimeNow,deadline);

        if(dateDiff<=30 && dateDiff>=0){
            return next();
        }

        logger.info(`Action(project abstract upload) is not allowed`);
        return res.status(400).json({
            status_code: 400,
            message: 'Sorry, project can be uploaded only 30 days before deadline.',
            data: {}
        });

    } catch(error){
        logger.error(error.toString());
        return res.status(400).json({
            status_code: 400,
            message: error.toString(),
            data: {}
        });
    }
}