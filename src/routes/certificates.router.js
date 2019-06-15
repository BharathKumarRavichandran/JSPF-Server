const router = require('express').Router();

// Importing controllers
const certificatesController = require('../controllers/certificates.controller');

// Student's certificate routes
router.post('/upload', certificatesController.uploadCertificate);
router.post('/view', certificatesController.viewCertificates);

module.exports = router;