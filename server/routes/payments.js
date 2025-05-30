const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const router = express.Router();

// Create checkout session
router.post('/create-checkout', async (req, res) => {
    try {
        const { priceId } = req.body;
        const user = await User.findById(req.user.id);
        
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/pricing`,
            metadata: {
                userId: user._id.toString()
            }
        });
        
        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        
        const user = await User.findById(userId);
        user.stripeCustomerId = session.customer;
        user.subscriptionId = session.subscription;
        user.plan = 'pro';
        user.emailLimit = 999999; // Unlimited
        await user.save();
    }
    
    res.json({received: true});
});

module.exports = router;