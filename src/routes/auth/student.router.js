const router = require('express').Router();

// Importing controllers
const studentController = require('../../controllers/auth/student.controller');

// Importing middlewares
const authMiddleware = require('../../middlewares/auth/student.middleware');
const checkStudentSession = authMiddleware.checkStudentSession;
const checkInstiVerificationAccess = authMiddleware.checkInstiVerificationAccess;
const checkAccountInactivation = authMiddleware.checkAccountInactivation;

// Primary email routes
router.post('/email/send-verification', checkAccountInactivation, studentController.sendVerificationCode);
router.post('/email/re-send-verification', checkAccountInactivation, studentController.reSendVerificationCode);
router.post('/email/verify', checkAccountInactivation, studentController.verifyEmail);

// Institute(.edu) email routes
router.post('/insti-email/send-verification', checkStudentSession, checkInstiVerificationAccess, studentController.sendInstiVerificationCode);
router.post('/insti-email/re-send-verification', checkStudentSession, checkInstiVerificationAccess, studentController.reSendInstiVerificationCode);
router.post('/insti-email/verify', checkStudentSession, checkInstiVerificationAccess, studentController.verifyInstiEmail);

// Password routes
router.post('/password/forgot', studentController.forgotPassword);
router.post('/password/reset', studentController.resetPassword);

// Auth routes
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.post('/logout', checkStudentSession, studentController.logoutStudent);

module.exports = router;