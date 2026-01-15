const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// View routes
router.get('/document/:id', publicController.renderDocumentView);
router.get('/verify/:id', publicController.renderVerifyView);

// API routes
router.get('/submission/:id', publicController.getSubmissionData);
router.post('/otp/request', publicController.requestOtp);
router.post('/otp/verify', publicController.verifyOtp);
router.post('/submit', publicController.submitForm);

module.exports = router;
