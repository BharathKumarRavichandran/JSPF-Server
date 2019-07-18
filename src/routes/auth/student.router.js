const router = require('express').Router();

// Importing controllers
const studentController = require('../../controllers/auth/student.controller');

// Importing middlewares
const authMiddleware = require('../../middlewares/auth/student.middleware');
const checkStudentSession = authMiddleware.checkStudentSession;
const checkInstiVerificationAccess = authMiddleware.checkInstiVerificationAccess;
const checkAccountInactivation = authMiddleware.checkAccountInactivation;

// Primary email routes
router.post('/email/verification-code/send', checkAccountInactivation, studentController.sendVerificationCode);
router.get('/email/verification-code/check', checkAccountInactivation, studentController.checkVerificationCode);

// Institute(.edu) email routes
router.post('/insti-email/verification-code/send', checkStudentSession, checkInstiVerificationAccess, studentController.sendInstiVerificationCode);
router.post('/insti-email/verification-code/verify', checkStudentSession, checkInstiVerificationAccess, studentController.verifyInstiEmail);

// Password routes
router.post('/password/forgot', studentController.forgotPassword);
router.post('/password/reset', studentController.resetPassword);

// Session routes
router.get('/session/check', studentController.checkSession);

// Auth routes
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.post('/logout', checkStudentSession, studentController.logoutStudent);

module.exports = router;