const path = require('path');

// Importing config/env variables
const config = require('../config/config');


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
    return bool;
}

exports.returnFilesLocationAsArray = async (student) => {
    try {
        let filesPathArray = new Array();

        // Add personalInfo pdf
        filesPathArray.push(path.join(config.directory.PUBLIC_DIR,student.personalInfo.filePath));

        // Add project abstract
        filesPathArray.push(path.join(config.directory.PUBLIC_DIR,student.abstract.projectAbstract));

        // Add final version of essays (SOP, Community, Society)
        let finalEssays = student.essays.final.toJSON();
        Object.values(finalEssays).forEach( (relativePath) => {
            filesPathArray.push(path.join(config.directory.PUBLIC_DIR,relativePath));
        });

        return {
            status_code: 200,
            message: 'Success',
            data: {
                filesPathArray: filesPathArray
            }
        }
    } catch (error) {
        return {
            status_code: 400,
            message: error.toString()
        }
    }
}