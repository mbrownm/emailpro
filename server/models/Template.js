const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, default: 'general' },
    variables: [{ name: String, placeholder: String }],
    isPublic: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);