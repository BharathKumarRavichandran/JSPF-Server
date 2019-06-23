const router = require('express').Router();

// Importing controllers
const essayController = require('../controllers/essays.controller');

// Student's essays routes
// Send to mentors routes
router.post('/mentors/sop/send',essayController.sendSOPToMentors);
router.post('/mentors/community/send', essayController.sendCommunityToMentors);
router.post('/mentors/society/send', essayController.sendSocietyToMentors);

// Final essays upload routes
router.post('/final/sop/upload', essayController.uploadFinalSOP);
router.post('/final/community/upload', essayController.uploadFinalCommunity);
router.post('/final/society/upload', essayController.uploadFinalSociety);
router.post('/final/view/all', essayController.viewFinalEssays);

module.exports = router;