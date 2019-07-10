const router = require('express').Router();

// Importing controllers
const requirementsController = require('../controllers/requirements.controller');

// Student's unfilled field routes
router.get('/pending/all', requirementsController.getAllPendingRequirements);
router.get('/pending/necessary', requirementsController.getNecessaryPendingRequirements);

module.exports = router;