const router = require('express').Router();

// Importing controllers
const essayController = require('../controllers/essays.controller');

// Student's essays routes
// Send to mentors routes
router.post('/mentors/sop/upload',essayController.uploadSOPToMentors);
router.post('/mentors/community/upload', essayController.uploadCommunityToMentors);
router.post('/mentors/society/upload', essayController.uploadSocietyToMentors);

// Final essays upload routes
router.post('/final/sop/upload', essayController.uploadFinalSOP);
router.post('/final/community/upload', essayController.uploadFinalCommunity);
router.post('/final/society/upload', essayController.uploadFinalSociety);
router.post('/final/view/all', essayController.viewFinalEssays);

module.exports = router;