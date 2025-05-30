const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    plan: { 
        type: String, 
        enum: ['free', 'pro', 'business'], 
        default: 'free' 
    },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    subscriptionStatus: { type: String },
    emailsUsed: { type: Number, default: 0 },
    emailLimit: { type: Number, default: 25 }, // Free tier limit
    resetDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', UserSchema);