const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalEmailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    followUpDays: { type: Number, required: true }, // Days to wait
    reminderDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'sent', 'cancelled'], default: 'pending' },
    template: { type: String }, // Follow-up message template
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FollowUp', FollowUpSchema);