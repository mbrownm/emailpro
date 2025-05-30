const express = require('express');
const router = express.Router();

// Simple demo auth for now
router.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    token: 'demo-token',
    user: { id: 'demo-user', email: 'demo@example.com' }
  });
});

router.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration successful',
    user: { id: 'demo-user', email: req.body.email }
  });
});

module.exports = router;