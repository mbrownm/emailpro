const express = require('express');
const EmailTracking = require('../models/EmailTracking');
const router = express.Router();

// Track email open
router.get('/open/:trackingId', async (req, res) => {
    try {
        const tracking = await EmailTracking.findOne({
            trackingId: req.params.trackingId
        });
        
        if (tracking && !tracking.opened) {
            tracking.opened = true;
            tracking.openedAt = new Date();
            tracking.openCount += 1;
            tracking.location = req.headers['cf-ipcountry'] || 'Unknown';
            tracking.device = req.headers['user-agent'] || 'Unknown';
            await tracking.save();
        }
        
        // Return 1x1 pixel image
        const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': pixel.length
        });
        res.end(pixel);
    } catch (error) {
        res.status(500).end();
    }
});

// Track link clicks
router.get('/click/:trackingId', async (req, res) => {
    try {
        const tracking = await EmailTracking.findOne({
            trackingId: req.params.trackingId
        });
        
        if (tracking) {
            tracking.clicks.push({
                url: req.query.url,
                clickedAt: new Date()
            });
            await tracking.save();
        }
        
        res.redirect(req.query.url);
    } catch (error) {
        res.redirect('/');
    }
});

// Get tracking stats
router.get('/stats/:emailId', async (req, res) => {
    try {
        const stats = await EmailTracking.findOne({
            emailId: req.params.emailId,
            userId: req.user.id
        });
        
        res.json(stats || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;