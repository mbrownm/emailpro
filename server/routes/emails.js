const express = require('express');
const nodemailer = require('nodemailer');
const Email = require('../models/Email');
const User = require('../models/User');
const EmailTracking = require('../models/EmailTracking');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, delayMinutes = 0 } = req.body;
    
    // For now, we'll simulate a user (since auth isn't fully set up)
    const userId = req.user?.id || 'demo-user';
    
    // Create email record
    const email = new Email({
      userId,
      to,
      subject,
      body,
      delayMinutes,
      scheduledFor: new Date(Date.now() + delayMinutes * 60000),
      status: delayMinutes > 0 ? 'scheduled' : 'sending'
    });
    
    await email.save();
    
    // Create tracking record
    const trackingId = uuidv4();
    const tracking = new EmailTracking({
      emailId: email._id,
      userId,
      recipient: to,
      trackingId
    });
    
    await tracking.save();
    
    if (delayMinutes === 0) {
      // Send immediately
      await sendEmailNow(email, tracking);
    } else {
      // Schedule for later (you'd use a job queue in production)
      setTimeout(() => sendEmailNow(email, tracking), delayMinutes * 60000);
    }
    
    res.json({ 
      success: true, 
      emailId: email._id,
      message: delayMinutes > 0 ? `Email scheduled for ${delayMinutes} minutes` : 'Email sent!'
    });
    
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to actually send the email
const sendEmailNow = async (email, tracking) => {
  try {
    const transporter = createTransporter();
    
    // Add tracking pixel to email body
    const trackingPixel = `<img src="${process.env.SERVER_URL}/api/tracking/open/${tracking.trackingId}" width="1" height="1" style="display:none">`;
    const emailBody = email.body + trackingPixel;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.to,
      subject: email.subject,
      html: emailBody
    };
    
    await transporter.sendMail(mailOptions);
    
    // Update email status
    email.status = 'sent';
    email.sentAt = new Date();
    await email.save();
    
    console.log(`✅ Email sent to ${email.to}`);
    
  } catch (error) {
    console.error('Failed to send email:', error);
    email.status = 'failed';
    email.error = error.message;
    await email.save();
  }
};

// Get user's emails
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const emails = await Email.find({ userId }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get email by ID
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;