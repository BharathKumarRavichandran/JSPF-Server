const archiver = require('archiver');
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const path = require('path');

// Importing config/env variables
const config = require('../config/config');
const logger = require('../config/winston');


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
            logger.info(archive.pointer() + ' total bytes');
            logger.info('Archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', () => {
            logger.info('Data has been drained');
        });

        archive.on('warning', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                logger.error('ENOENT: File not found');
                throw('File not found');
            } else {
                logger.error(error.toString());
                throw error;
            }
        });

        archive.on('error', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                logger.error('ENOENT: File not found');
                throw('File not found');
            } else {
                logger.error(error.toString());
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

        if(!bool){
            logger.error('File(s) not found');
            throw new Error('File(s) not found.');
        }

        // Write everything to disk
        await archive.finalize();

        let status_code = 200;
        return {
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        }

    } catch (error) {
        logger.error(error.toString());
        let status_code = 500;
        return {
            status_code: status_code,
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
            logger.info(archive.pointer() + ' total bytes');
            logger.info('Archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', function() {
            logger.info('Data has been drained');
        });

        archive.on('warning', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                logger.error('ENOENT: File not found');
                throw('File not found');
            } else {
                logger.error(error.toString());
                throw error;
            }
        });

        archive.on('error', (error) => {
            if (error.code === 'ENOENT') { // stat failures
                logger.error('ENOENT: File not found');
                throw('File not found');
            } else {
                logger.error(error.toString());
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
                logger.error(error.toString());
                let status_code = 500;
                return {
                    status_code: status_code,
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
                logger.error(error.toString());
                let status_code = 500;
                return {
                    status_code: status_code,
                    message: error.toString(),
                    data: {}
                }
            }
        });

        if(!bool){
            logger.error('File(s) not found.');
            throw new Error('File(s) not found.');
        }

        // Write everything to disk
        await archive.finalize();

        let status_code = 200;
        return {
            status_code: status_code,
            message: HttpStatus.getStatusText(status_code),
            data: {}
        }
    } catch (error) {
        logger.error(error.toString());
        let status_code = 500;
        return {
            status_code: status_code,
            message: error.toString(),
            data: {}
        }
    }
}
