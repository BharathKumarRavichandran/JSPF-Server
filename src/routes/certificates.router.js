const router = require('express').Router();

// Importing controllers
const certificatesController = require('../controllers/certificates.controller');

// Student's certificate routes
router.post('/gradeSheetSem1/upload', certificatesController.uploadGradeSheetSem1);
router.post('/instiCertificate/upload', certificatesController.uploadInstiCertificate);
router.post('/nonInstiCertificate/upload', certificatesController.uploadNonInstiCertificate);
router.post('/gradeSheetMOOC/upload', certificatesController.uploadGradeSheetMOOC);
router.post('/view/all', certificatesController.viewCertificates);

module.exports = router;