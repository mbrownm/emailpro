import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PricingPage = () => {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            features: [
                '25 emails/month',
                '30-second delay',
                'Basic templates',
                'Email tracking'
            ],
            priceId: null
        },
        {
            name: 'Pro',
            price: '$19',
            features: [
                'Unlimited emails',
                '2-minute delay + edit',
                'Advanced templates',
                'Full analytics',
                'Follow-up reminders',
                'Priority support'
            ],
            priceId: 'price_pro_monthly',
            popular: true
        },
        {
            name: 'Business',
            price: '$49',
            features: [
                'Everything in Pro',
                'Team collaboration',
                'Custom branding',
                'API access',
                'Advanced automation',
                'Dedicated support'
            ],
            priceId: 'price_business_monthly'
        }
    ];

    const handleSubscribe = async (priceId) => {
        if (!priceId) return;
        
        try {
            const response = await axios.post('/api/payments/create-checkout', {
                priceId
            });
            
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({
                sessionId: response.data.sessionId
            });
        } catch (error) {
            alert('Error processing payment');
        }
    };

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <h1>Choose Your Plan</h1>
                <p>Start with our free plan and upgrade as you grow</p>
            </div>
            
            <div className="pricing-grid">
                {plans.map(plan => (
                    <div 
                        key={plan.name} 
                        className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                    >
                        {plan.popular && <div className="popular-badge">Most Popular</div>}
                        
                        <h3>{plan.name}</h3>
                        <div className="price">
                            {plan.price}
                            <span>/month</span>
                        </div>
                        
                        <ul className="features">
                            {plan.features.map(feature => (
                                <li key={feature}>✅ {feature}</li>
                            ))}
                        </ul>
                        
                        <button 
                            onClick={() => handleSubscribe(plan.priceId)}
                            className={`subscribe-btn ${plan.popular ? 'popular-btn' : ''}`}
                        >
                            {plan.priceId ? 'Subscribe Now' : 'Current Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPage;