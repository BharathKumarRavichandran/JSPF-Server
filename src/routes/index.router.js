const router = require('express').Router();

// Importing middlewares
const authMiddleware = require('../middlewares/auth/student.middleware');
const checkStudentSession = authMiddleware.checkStudentSession;
const checkAccountActivation = authMiddleware.checkAccountActivation;

// Importing routers
const abstractRouter = require('./abstract.router');
const authRouter = require('./auth/index.router');
const certificatesRouter = require('./certificates.router');
const essaysRouter = require('./essays.router');
const formRouter = require('./form.router');
const personalInfoRouter = require('./personalInfo.router');
const requirementsRouter = require('./requirements.router');
const signatureRouter = require('./signature.router');

// Defining routes
router.use('/abstract', checkStudentSession, checkAccountActivation, abstractRouter);
router.use('/auth', authRouter);
router.use('/certificates', checkStudentSession, checkAccountActivation, certificatesRouter);
router.use('/essays', checkStudentSession, checkAccountActivation, essaysRouter);
router.use('/form', checkStudentSession, formRouter);
router.use('/personal-info', checkStudentSession, checkAccountActivation, personalInfoRouter);
router.use('/requirements', checkStudentSession, checkAccountActivation, requirementsRouter);
router.use('/signature', checkStudentSession, checkAccountActivation, signatureRouter);

module.exports = router;