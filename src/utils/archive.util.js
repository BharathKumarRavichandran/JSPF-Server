const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Importing config/env variables
const config = require('../config/config');


exports.archiveSummary = async (student) => {
    try {
        let bool = true;
        let archiveFileRelativePath = student.archive.summary;
        let archiveFilePath = path.join(config.directory.PUBLIC_DIR,archiveFileRelativePath);
        while(fs.existsSync(archiveFilePath))
            fs.unlink(archiveFilePath);

        let archive = archiver(config.files.archive.format);
        let output = fs.createWriteStream(archiveFilePath);

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('Archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', () => {
            console.log('Data has been drained');
        });

        archive.on('warning', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                throw('File not found');
                // log error
            } else {
                throw error;
            }
        });

        archive.on('error', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                throw('File not found');
                // log error
            } else {
                throw error;
            }
        });

        archive.pipe(output);

        // Add summary application pdf
        let summaryApplication = path.join(config.directory.PUBLIC_DIR,student.applicationFilePath);
        bool = bool && fs.existsSync(summaryApplication);
        archive.file(summaryApplication,{name: path.basename(summaryApplication)});
        
        // Add abstract's supporting files
        for(let i=0;i<student.abstract.supportingFiles.length;i++){
            let location = path.join(config.directory.PUBLIC_DIR,student.abstract.supportingFiles[i]);
            bool = bool && fs.existsSync(location);
            archive.file(location,{name: path.basename(location)});
        }

        if(!bool)
            throw(new Error('File(s) not found.'));

        // Write everything to disk
        await archive.finalize();

        return {
            status_code: 200,
            message: 'Success',
            data: {}
        }

    } catch (error) {
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}

exports.archiveAllFinal = async (student) => {
    try {
        let bool = true;
        let archiveFileRelativePath = student.archive.final;
        let archiveFilePath = path.join(config.directory.PUBLIC_DIR,archiveFileRelativePath);
        while(fs.existsSync(archiveFilePath))
            fs.unlink(archiveFilePath);
        
        let archive = archiver(config.files.archive.format);
        let output = fs.createWriteStream(archiveFilePath);

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('Archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(error) {
            if (error.code === 'ENOENT') { // stat failures
                throw('File not found');
                // log error
            } else {
                throw error;
            }
        });

        archive.on('error', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                throw('File not found');
                // log error
            } else {
                throw error;
            }
        });

        archive.pipe(output);

        // Add summary application
        let summaryApplication = path.join(config.directory.PUBLIC_DIR,student.applicationFilePath);
        bool = bool && fs.existsSync(summaryApplication);
        archive.file(summaryApplication,{name: path.basename(summaryApplication)});

        // Add certificates
        Object.values(student.certificates).forEach( async (relativePath) => {
            try {
                let location = path.join(config.directory.PUBLIC_DIR,relativePath);
                bool = bool && fs.existsSync(location);
                archive.file(location,{name: path.basename(location)});
            } catch (error) {
                return {
                    status_code: 400,
                    message: error.toString(),
                    data: {}
                }
            }
        });

        // Add abstract and supporting files
        let abstract = path.join(config.directory.PUBLIC_DIR,student.abstract.projectAbstract);
        bool = bool && fs.existsSync(abstract);
        archive.file(abstract,{name: path.basename(student.abstract.projectAbstract)});
        for(let i=0;i<student.abstract.supportingFiles.length;i++){
            let location = path.join(config.directory.PUBLIC_DIR,student.abstract.supportingFiles[i]);
            bool = bool && fs.existsSync(location);
            archive.file(location,{name: path.basename(location)});
        }

        // Add essays
        Object.values(student.essays.final).forEach( async (relativePath) => {
            try {
                let location = path.join(config.directory.PUBLIC_DIR,relativePath);
                bool = bool && fs.existsSync(location);
                archive.file(location,{name: path.basename(relativePath)});
            } catch (error) {
                return {
                    status_code: 400,
                    message: error.toString(),
                    data: {}
                }
            }
        });

        if(!bool)
            throw(new Error('File(s) not found.'));

        // Write everything to disk
        await archive.finalize();

        return {
            status_code: 200,
            message: 'Success',
            data: {}
        }
    } catch (error) {
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}
