const delay = require('delay');
const ejs = require('ejs');
const fs = require('fs');
const pdfMerge = require('easy-pdf-merge');
const wkhtmltopdf = require('wkhtmltopdf');

// Importing config/env variables
const config = require('../config/config');
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
        let html = await compiledEJS({
            student: student,
            PUBLIC_DIR: config.directory.PUBLIC_DIR,
            START_YEAR: config.date.START_YEAR,
            END_YEAR: config.date.END_YEAR
        });

        console.log(html);
        
        let pdfOptions = {
            pageSize: 'A4',
            output: destinationFilePath,
            "margin-top": '20mm',
            "margin-bottom": '20mm',
            "margin-left": '20mm',
            "margin-right": '20mm',
        };

        await exportHTML(html, pdfOptions);

        await delay(3000);
        
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
        let mergerResponse = await promisePdfMerger(sourceFilesArray,destinationFilePath);

        await delay(4000);
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