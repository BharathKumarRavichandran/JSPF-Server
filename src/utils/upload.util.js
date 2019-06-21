const path = require('path');
const multer = require('multer');
const util = require('util');

// Importing config/env variables
const config = require('../config/config');


class Uploader {

    constructor(req,applicationNumber,fileOptions) {

        // Set The Storage Engine
        const storageOptions = multer.diskStorage({
            destination: path.join(config.directory.UPLOADS_DIR,applicationNumber),
            filename: function (req, file, cb) {
                cb(null, fileOptions.fileName + '_' + Date.now() + path.extname(file.originalname));
            },
            onError : function(error, next) {
                return {
                    status_code: 400,
                    message: error.toString()
                }
            }
        });

        // Check File Type
        const checkFileType = (file, allowedFileTypesRE, cb) => {
            // Check extension
            const extname = allowedFileTypesRE.test(path.extname(file.originalname).toLowerCase());
            // Check mimetype
            const mimetype = allowedFileTypesRE.test(file.mimetype);
            if (mimetype && extname) {
                return cb(null, true);
            } else {
                cb('Error: Upload only allowed file types');
            }
        }

        this.upload = multer({
            storage: storageOptions,
            limits: { fileSize: fileOptions.allowedFileSize },
            fileFilter: function (req, file, cb) {   
                checkFileType(file,fileOptions.allowedFileTypesRE,cb);
            }
        });

    }

    async uploadSingle(req, res, fieldName) {
        try {
            const upload = util.promisify(this.upload.single(fieldName));
            let response = await upload(req, res);
            return {
                status_code: 200,
                message: 'File has been successfully uploaded.',
                data: {
                    file: req.file
                }
            }
        } catch (error) {
            return {
                status_code: 400,
                message: error.toString()
            }
        }
    }

    async uploadMulti(req, res, fieldDetails) {
        try {
            const upload = util.promisify(this.upload.array(fieldDetails.fieldName,fieldDetails.maxCount));
            let response = await upload(req, res);
            return {
                status_code: 200,
                message: 'Files have been successfully uploaded.',
                data: {
                    files: req.files
                }
            }
        } catch (error) {
            return {
                status_code: 400,
                message: error.toString()
            }
        }
    }

}

module.exports = Uploader;
