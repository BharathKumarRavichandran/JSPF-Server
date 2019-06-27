const ejs = require('ejs');
const fs = require('fs');
const pdfMerge = require('easy-pdf-merge');
const wkhtmltopdf = require('wkhtmltopdf');

// Importing config/env variables
const logger = require('../config/winston');


exports.generatePdf = async(student,ejsPath,destinationFilePath) => {
    try {
        let compiledEJS = ejs.compile(fs.readFileSync(ejsPath, 'utf8'));
        let html = compiledEJS({student: student});
        
        let options = {
            pageSize: 'Letter',
            output: destinationFilePath
        };

        await wkhtmltopdf(html,options);
        
        return {
            status_code: 200,
            message: 'Success',
            data: {}
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

const promisePdfMerger = (sourceFilesArray,destinationFilePath) => {
    return new Promise((resolve,reject) =>{
        pdfMerge(sourceFilesArray,destinationFilePath, (error) => {
            if(error){
                logger.error(error.toString());
                reject(error);
            }
    
            let response = {
                status_code: 200,
                message: 'PDFs have been successfully merged.'
            }
            resolve(response);
        });
    });
}

exports.mergePdf = async (sourceFilesArray,destinationFilePath) => {
    try {
        let mergerResponse = await promisePdfMerger(sourceFilesArray,destinationFilePath)
        return {
            status_code: mergerResponse.status_code,
            message: mergerResponse.message,
            data: {}
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