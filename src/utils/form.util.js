exports.checkFormSubmission = (student) => {
    let bool = (
        student.email &&
        student.instiEmail &&
        student.verificationCode &&
        student.instiVerificationCode &&
        student.isVerified1 &&
        student.isVerified2 &&
        student.applicationNumber &&
        student.personalInfo &&
        student.personalInfo.name &&
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