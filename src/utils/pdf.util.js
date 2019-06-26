const ejs = require('ejs');
const fs = require('fs');
const pdfMerge = require('easy-pdf-merge');
const wkhtmltopdf = require('wkhtmltopdf');


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
            message: 'Success'
        }

    } catch (error) {
        return {
            status_code: 400,
            message: error.toString()
        }
    }
}

const promisePdfMerger = (sourceFilesArray,destinationFilePath) => {
    return new Promise((resolve,reject) =>{
        pdfMerge(sourceFilesArray,destinationFilePath, (error) => {
            if(error){
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
            message: mergerResponse.message
        }
    } catch (error) {
        return {
            status_code: 400,
            message: error.toString()
        }
    }
}