import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const MembershipPlans = () => {
  const plans = [
    {
      type: 'basic',
      name: 'Basic Membership',
      price: 29.99,
      features: [
        'Basic Profile',
        'Up to 5 Portfolio Images',
        'Contact Form',
        'Basic Analytics'
      ]
    },
    {
      type: 'premium',
      name: 'Premium Membership',
      price: 79.99,
      features: [
        'Enhanced Profile',
        'Unlimited Portfolio',
        'Booking System',
        'Featured Listing',
        'Advanced Analytics'
      ]
    },
    {
      type: 'elite',
      name: 'Elite Membership',
      price: 199.99,
      features: [
        'Premium Profile',
        'Priority Placement',
        'Video Gallery',
        'Client Management',
        'Marketing Tools',
        'API Access'
      ]
    }
  ];

  const handleSubscribe = async (planType) => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });
      const session = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="membership-plans">
      <h2>Professional Membership Plans</h2>
      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.type} className={`plan-card ${plan.type}`}>
            <h3>{plan.name}</h3>
            <div className="price">${plan.price}/month</div>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.type)}
              className="subscribe-button"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;
