const router = require('express').Router();

// Importing controllers
const essayController = require('../controllers/essays.controller');

// Student's essays routes
// Send to mentors routes
router.post('/mentors/sop/upload',essayController.uploadSOPToMentors);
router.post('/mentors/community/upload', essayController.uploadCommunityToMentors);
router.post('/mentors/society/upload', essayController.uploadSocietyToMentors);

// Final essays upload routes
router.post('/final/sop/upload', essayController.uploadSOPFinal);
router.post('/final/community/upload', essayController.uploadCommunityFinal);
router.post('/final/society/upload', essayController.uploadSocietyFinal);
router.post('/final/view/all', essayController.viewFinalEssays);

module.exports = router;