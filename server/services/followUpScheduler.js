const cron = require('node-cron');
const FollowUp = require('../models/FollowUp');
const EmailTracking = require('../models/EmailTracking');
const Email = require('../models/Email');

// Check for follow-ups every hour
const start = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const followUps = await FollowUp.find({
                status: 'pending',
                reminderDate: { $lte: new Date() }
            });

            for (const followUp of followUps) {
                await processFollowUp(followUp);
            }
        } catch (error) {
            console.error('Follow-up scheduler error:', error);
        }
    });
};

const processFollowUp = async (followUp) => {
    try {
        // Check if original email was opened
        const tracking = await EmailTracking.findOne({
            emailId: followUp.originalEmailId
        });
        
        // Only send follow-up if email wasn't opened
        if (!tracking || !tracking.opened) {
            const followUpEmail = new Email({
                userId: followUp.userId,
                to: followUp.recipient,
                subject: `Follow-up: ${followUp.subject}`,
                body: followUp.template || 'Following up on my previous email...',
                scheduledFor: new Date(), // Send immediately
                delayMinutes: 0
            });
            
            await followUpEmail.save();
        }
        
        followUp.status = 'sent';
        await followUp.save();
        
    } catch (error) {
        console.error('Failed to process follow-up:', error);
    }
};

module.exports = { start };