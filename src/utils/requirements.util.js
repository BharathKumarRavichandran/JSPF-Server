exports.getAllPendingRequirements = (student) => {

    let necessaryRequirements = this.getNecessaryPendingRequirements(student).necessaryRequirements;

    // Personal Information
    let personalInformation = new Array();

    if(!student.personalInfo.gender)
        personalInformation.push('Gender');
    
    if(!student.personalInfo.disability.status){
        personalInformation.push('Disability');
    }
    else{
        if(student.personalInfo.disability.status=='Yes' && !student.personalInfo.disability.description)
            personalInformation.push('Disability description');
    }

    if(!student.personalInfo.nationality)
        personalInformation.push('Nationality');
    
    if(!student.personalInfo.firstGenStudent)
        personalInformation.push('First Generation Student status');

    if(!student.personalInfo.refugee)
        personalInformation.push('Refugee status');
    

    // Project Abstract
    let abstract = new Array();

    if(!student.abstract.supportingFiles)
        abstract.push('Project abstract supporting files');
    
    
    // Essays
    let essays = new Array();

    if(!student.essays.mentors.sop)
        abstract.push('Google document link of Statement of Purpose');

    if(!student.essays.mentors.community)
        abstract.push(`Google document link of 'For the community' essay`);

    if(!student.essays.mentors.society)
        abstract.push(`Google document link of 'For the society' essay`);

    
    let optionalRequirements = {
        personalInfo: personalInformation,
        certificates: [],
        abstract: abstract,
        essays: essays
    }

    let allRequirements = {
        necessaryRequirements: necessaryRequirements,
        optionalRequirements: optionalRequirements
    }

    return allRequirements;
}

exports.getNecessaryPendingRequirements = (student) => {

    // Personal Information
    let personalInformation = new Array();

    if(!student.personalInfo.introduction)
        personalInformation.push('Introduction');
    
    if(!student.personalInfo.pronoun)
        personalInformation.push('Preferred pronoun');
    

    // Certificates and Grade sheets
    let certificates = new Array();

    if(!student.certificates.gradeSheetSem1)
        certificates.push('Scanned copy of the original Semester 1 grade sheet');
    
    if(!student.certificates.instiCertificate)
        certificates.push('Scanned copy of the Certificate of Participation or Merit of the contest conducted by affiliates of NIT Trichy');

    if(!student.certificates.nonInstiCertificate)
        certificates.push('Scanned copy of the Certificate of Participation or Merit of the contest conducted by institutes other than NIT Trichy');

    if(!student.certificates.gradeSheetMOOC)
        certificates.push('Screenshot or Original grade sheet of the completed MOOC');
    

    // Project Abstract
    let abstract = new Array();
    
    if(!student.abstract.docLink)
        abstract.push('Google doc link of your project abstract');

    if(!student.abstract.projectAbstract)
        abstract.push('Abstract of your technical/interdisciplinary project');


    // Essays
    let essays = new Array();
    
    if(!student.essays.final.sop)
        essays.push('Final version of Statement of Purpose');
    
    if(!student.essays.final.community)
        essays.push(`Final version of 'For the community' essay`);

    if(!student.essays.final.society)
        essays.push(`Final version of 'For the society' essay`);

    
    let necessaryRequirements = {
        personalInfo: personalInformation,
        certificates: certificates,
        abstract: abstract,
        essays: essays
    }

    return {
        necessaryRequirements: necessaryRequirements
    }
}