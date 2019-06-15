const router = require('express').Router();

// Importing controllers
const formController = require('../controllers/form.controller');

// Final form submission routes
router.post('/preview', formController.previewForm);
router.post('/submit', formController.submitForm);

module.exports = router;