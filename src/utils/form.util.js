const fs = require('fs');
const path = require('path');

// Importing config/env variables
const config = require('../config/config');
const logger = require('../config/winston');

exports.checkFormSubmission = (student) => {
    let bool = (
        student.email &&
        student.instiEmail &&
        student.verificationCode &&
        student.isVerified1 &&
        student.isVerified2 &&
        student.applicationNumber &&
        student.personalInfo &&
        student.personalInfo.name &&
        student.personalInfo.rollNumber &&
        student.personalInfo.department &&
        student.personalInfo.contactNumberCall &&
        student.personalInfo.contactNumberWhatsapp &&
        student.personalInfo.tshirtSize &&
        student.personalInfo.introduction &&
        student.personalInfo.pronoun &&
        student.certificates &&
        student.certificates.gradeSheetSem1 &&
        student.certificates.instiCertificate &&
        student.certificates.nonInstiCertificate &&
        student.certificates.gradeSheetMOOC &&
        student.abstract &&
        student.abstract.docLink &&
        student.abstract.projectAbstract &&
        student.essays &&
        student.essays.final &&
        student.essays.final.sop &&
        student.essays.final.community &&
        student.essays.final.society &&
        student.signature
    );

    if(student.personalInfo.disability.status && student.personalInfo.disability.status=='Yes')
        bool = bool && student.personalInfo.disability.description;

    return bool;
}

exports.returnFilesLocationAsArray = async (student) => {
    try {
        let bool = true;
        let filesPathArray = new Array();

        // Add personalInfo pdf
        let personalInfoPath = path.join(config.directory.PUBLIC_DIR,student.personalInfo.filePath);
        bool = bool && fs.existsSync(personalInfoPath);
        filesPathArray.push(personalInfoPath);
        console.log(personalInfoPath);

        // Add project abstract
        let abstractPath = path.join(config.directory.PUBLIC_DIR,student.abstract.projectAbstract);
        bool = bool && fs.existsSync(abstractPath);
        filesPathArray.push(abstractPath);

        // Add final version of essays (SOP, Community, Society)
        let finalEssays = student.essays.final.toJSON();
        Object.values(finalEssays).forEach( (relativePath) => {
            let location = path.join(config.directory.PUBLIC_DIR,relativePath);
            bool = bool && fs.existsSync(location);
            filesPathArray.push(location);
        });

        if(!bool){
            return {
                status_code: 400,
                message: 'File(s) not found. Try uploading again!',
                data: {}
            }
        }

        return {
            status_code: 200,
            message: 'Success',
            data: {
                filesPathArray: filesPathArray
            }
        }
    } catch (error) {
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}