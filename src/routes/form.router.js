const router = require('express').Router();

// Importing controllers
const formController = require('../controllers/form.controller');

// Importing middlewares
const authMiddleware = require('../middlewares/auth/student.middleware');
const checkAccountActivation = authMiddleware.checkAccountActivation;

// Form access and get routes
router.get('/access', formController.formAccess);
router.get('/application-number', formController.getApplicationNumber);

// Form status routes
router.get('/status', checkAccountActivation, formController.getFormStatus);

// Final form submission routes
router.post('/generate', checkAccountActivation, formController.generateApplication);
router.get('/view', checkAccountActivation, formController.viewApplication);
router.post('/submit', checkAccountActivation, formController.submitForm);

module.exports = router;