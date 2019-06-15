const router = require('express').Router();

// Importing controllers
const signatureController = require('../controllers/signature.controller');

// Student's signature routes
router.post('/update', signatureController.updateSignature);
router.post('/get', signatureController.getSignature);

module.exports = router;