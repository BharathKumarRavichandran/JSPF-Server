const router = require('express').Router();

// Importing controllers
const abstractController = require('../controllers/abstract.controller');

// Importing middlewares
const deadlineMiddleware = require('../middlewares/deadline.middleware');

// Student's abstracts routes
router.post('/mentors/send', deadlineMiddleware.sendToMentorsDeadline, abstractController.sendDocLink);
router.post('/final-abstract/upload', deadlineMiddleware.finalProjectDeadline, abstractController.uploadFinalAbstract);
router.post('/supporting-files/upload', deadlineMiddleware.finalProjectDeadline, abstractController.uploadSupportingFiles);
router.post('/final/view/all', abstractController.viewAbstract);

module.exports = router;
