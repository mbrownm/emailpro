const cron = require('node-cron');
const Email = require('../models/Email');
const nodemailer = require('nodemailer');

// SMTP transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Check every 30 seconds for emails to send
const start = () => {
    cron.schedule('*/30 * * * * *', async () => {
        try {
            const emailsToSend = await Email.find({
                status: 'pending',
                scheduledFor: { $lte: new Date() }
            });

            for (const email of emailsToSend) {
                await sendEmail(email);
            }
        } catch (error) {
            console.error('Email scheduler error:', error);
        }
    });
};

const sendEmail = async (emailDoc) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailDoc.to,
            subject: emailDoc.subject,
            html: emailDoc.body
        });

        emailDoc.status = 'sent';
        await emailDoc.save();
        
        console.log(`✅ Email sent to ${emailDoc.to}`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

module.exports = { start };