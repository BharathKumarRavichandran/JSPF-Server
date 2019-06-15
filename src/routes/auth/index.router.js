const router = require('express').Router();

// Importing routers
const studentAuthRouter = require('./student.router');

// Defining routes
router.use('/student', studentAuthRouter);

module.exports = router;