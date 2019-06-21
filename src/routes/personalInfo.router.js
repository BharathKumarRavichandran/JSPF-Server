const router = require('express').Router();

// Importing controllers
const personalInfoController = require('../controllers/personalInfo.controller')

// Student's personal information routes
router.post('/update', personalInfoController.updateInfo);
router.post('/view/all', personalInfoController.getInfo);

module.exports = router;