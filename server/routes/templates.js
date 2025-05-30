const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

// Get all templates
router.get('/', async (req, res) => {
    try {
        const templates = await Template.find({
            $or: [
                { userId: req.user.id },
                { isPublic: true }
            ]
        }).sort({ usageCount: -1 });
        
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create template
router.post('/', async (req, res) => {
    try {
        const template = new Template({
            ...req.body,
            userId: req.user.id
        });
        
        await template.save();
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use template (increment usage)
router.post('/:id/use', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        template.usageCount += 1;
        await template.save();
        
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;