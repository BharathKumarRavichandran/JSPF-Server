const router = require('express').Router();

// Importing controllers
const requirementsController = require('../controllers/requirements.controller');

// Student's unfilled field routes
router.post('/pending/all', requirementsController.getAllPendingRequirements);
router.post('/pending/necessary', requirementsController.getNecessaryPendingRequirements);

module.exports = router;