const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Using String for demo
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    delayMinutes: { type: Number, default: 0 },
    scheduledFor: { type: Date, default: Date.now },
    sentAt: { type: Date },
    status: { 
        type: String, 
        enum: ['scheduled', 'sending', 'sent', 'failed'], 
        default: 'scheduled' 
    },
    error: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Email', EmailSchema);