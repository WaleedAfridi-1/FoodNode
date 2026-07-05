const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTPVerification = require('../models/otpVerification');
const User = require('../models/user.model');
const foodPartner = require("../models/foodPartner.model"); 




// Nodemailer SMTP Setup (Gmail App Password ke sath)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// ROUTE 1: SEND OTP
// ==========================================
const SendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // 6-digit secure numeric code
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes expiry

  try {
    // MongoDB me upsert operation
    await OTPVerification.findOneAndUpdate(
      { email },
      { otp, expiresAt, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Minimalist High-Contrast Industry Level Design Configuration
    const mailOptions = {
      from: `"FoodView Auth" <${process.env.EMAIL_USER}>`,
      to: email, // Har user ko deliver hoga bina kisi limitation ke
      subject: 'Verify your email address',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; padding: 40px; color: #000000; max-width: 480px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 24px; color: #111111;">Verify your email</h2>
          <p style="font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 32px;">Use the following verification code to confirm your email address. This code is valid for 5 minutes.</p>
          <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; font-size: 32px; font-weight: 700; letter-spacing: 0.2em; text-align: center; margin-bottom: 32px; color: #000000;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #888888; line-height: 1.4;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    };

    // Mail fire karna
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ==========================================
// ROUTE 2: VERIFY OTP
// ==========================================
// otp.controller.js
const jwt = require("jsonwebtoken");

const VerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  try {
    const record = await OTPVerification.findOne({ email });

    if (!record) {
      return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
    }

    if (new Date() > record.expiresAt) {
      await OTPVerification.deleteOne({ email });
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Success: Clear OTP data
    await OTPVerification.deleteOne({ email });

    // Generate a short-lived token (15 mins) stating this email is pre-verified
    const verificationToken = jwt.sign(
      { email, verified: true }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '15m' }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully!',
      verificationToken // Yeh token frontend local/session storage me save karega
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Verification process failed' });
  }
};

module.exports = {
  SendOtp,
  VerifyOtp
};