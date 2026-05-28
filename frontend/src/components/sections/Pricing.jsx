import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      features: [
        '3 AI Mock Interviews / mo',
        'Basic Resume Analysis',
        'Access to 5 Tech Stacks',
        'Community Support'
      ],
      cta: 'Start for Free',
      highlight: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: [
        'Unlimited AI Mock Interviews',
        'Advanced ATS Optimization',
        'All 20+ Tech Stacks',
        'Priority AI Feedback',
        'Detailed Skill Analytics'
      ],
      cta: 'Get Started with Pro',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact Sales',
      features: [
        'Bulk Candidate Interviews',
        'Custom Tech Stack Creation',
        'API Access',
        'Dedicated Support'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-header">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="section-badge"
        >
          Pricing
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Simple Plans for <span className="gradient-text">Career Growth</span>
        </motion.h2>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`pricing-card ${plan.highlight ? 'highlight' : 'glass-card'}`}
          >
            {plan.highlight && <div className="popular-badge">Most Popular</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">
              <span className="amount">{plan.price}</span>
              <span className="period">/{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feat, fi) => (
                <li key={fi}>✓ {feat}</li>
              ))}
            </ul>
            <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
