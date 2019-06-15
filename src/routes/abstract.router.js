const router = require('express').Router();

// Importing controllers
const abstractController = require('../controllers/abstract.controller');

// Importing middlewares
const deadlineMiddleware = require('../middlewares/deadline.middleware');

// Student's abstracts routes
router.post('/mentors', deadlineMiddleware.sendToMentorsDeadline, abstractController.uploadDocLink);
router.post('/final/upload', deadlineMiddleware.finalProjectDeadline, abstractController.uploadFinalAbstract);
router.post('/final/view', abstractController.viewAbstract);

module.exports = router;
