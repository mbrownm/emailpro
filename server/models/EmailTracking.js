const mongoose = require('mongoose');

const EmailTrackingSchema = new mongoose.Schema({
    emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: String, required: true },
    trackingId: { type: String, unique: true, required: true },
    opened: { type: Boolean, default: false },
    openedAt: { type: Date },
    openCount: { type: Number, default: 0 },
    clicks: [{
        url: String,
        clickedAt: { type: Date, default: Date.now }
    }],
    location: { type: String },
    device: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailTracking', EmailTrackingSchema);