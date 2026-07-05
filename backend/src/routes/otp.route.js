const express = require('express');
const otpController = require('../controllers/otp.controller');
const router = express.Router();

// /api/otp/send 
router.post("/send", otpController.SendOtp);

// /api/otp/verify 
router.post("/verify", otpController.VerifyOtp);

module.exports = router;