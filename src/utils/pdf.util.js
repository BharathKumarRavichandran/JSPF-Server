const ejs = require('ejs');
const fs = require('fs');
const pdfMerge = require('easy-pdf-merge');
const wkhtmltopdf = require('wkhtmltopdf');

// Importing config/env variables
const logger = require('../config/winston');

const exportHTML = async (html,pdfOptions) => {
	return new Promise((resolve, reject) => {
		wkhtmltopdf(html, pdfOptions, (error) => {
			if (error) {
                logger.error(error);
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

exports.generatePdf = async (student,ejsPath,destinationFilePath) => {
    try {
        let compileOptions = {
            async: true
        };
        let compiledEJS = await ejs.compile(fs.readFileSync(ejsPath, 'utf8'),compileOptions);
        let html = await compiledEJS({student: student});
        
        let pdfOptions = {
            pageSize: 'Letter',
            output: destinationFilePath
        };

        await exportHTML(html, pdfOptions);
        
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