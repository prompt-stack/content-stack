/**
 * @file pages/SubscriptionPage.tsx
 * @purpose Subscription page component
 * @layer page
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role entrypoint
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useUser } from '@/hooks/useUser'
import clsx from 'clsx'

interface PricingTier {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  price: string
  interval?: string
  description: string
  features: string[]
  limitations?: string[]
  cta: string
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out Content Stack',
    features: [
      '100 content items',
      'Basic inbox features',
      'Text and URL extraction',
      'Manual export only',
      'Community support'
    ],
    limitations: [
      'No API access',
      'No bulk operations',
      'Limited file types'
    ],
    cta: 'Current Plan'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    interval: '/month',
    description: 'For creators and professionals',
    features: [
      'Unlimited content items',
      'All extraction types',
      'Bulk operations',
      'API access',
      'Advanced search',
      'Auto-categorization',
      'Priority support',
      'Export to any format'
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'SSO authentication',
      'Advanced analytics',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Custom AI models'
    ],
    cta: 'Contact Sales'
  }
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const currentTier = user?.tier || 'free'

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'enterprise') {
      // Open contact form or email
      window.location.href = 'mailto:sales@contentstack.com?subject=Enterprise Inquiry'
    } else if (tierId === 'pro') {
      // TODO: Integrate with payment provider
      console.log('Upgrade to Pro - Payment flow')
    }
  }

  const getYearlyPrice = (monthlyPrice: string) => {
    const price = parseInt(monthlyPrice.replace('$', ''))
    const yearlyPrice = price * 10 // 2 months free
    return `$${yearlyPrice}`
  }

  return (
    <div className="subscription__page">
      <div className="subscription__header">
        <button 
          className="subscription__back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <i className="fas fa-arrow-left" />
        </button>
        
        <div className="subscription__header-content">
          <h1 className="subscription__title">Choose Your Plan</h1>
          <p className="subscription__subtitle">
            Unlock the full potential of Content Stack with our flexible pricing
          </p>
          
          <div className="subscription__billing-toggle">
            <button
              className={clsx('subscription__billing-option', billingCycle === 'monthly' && 'subscription__billing-option--active')}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={clsx('subscription__billing-option', billingCycle === 'yearly' && 'subscription__billing-option--active')}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="subscription__billing-badge">Save 17%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="subscription__pricing-grid">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.id}
            className={clsx(
              'subscription__pricing-card',
              tier.popular && 'subscription__pricing-card--popular',
              currentTier === tier.id && 'subscription__pricing-card--current'
            )}
          >
            {tier.popular && (
              <div className="subscription__popular-badge">
                <i className="fas fa-star" /> Most Popular
              </div>
            )}
            
            <div className="subscription__card-header">
              <h3 className="subscription__tier-name">{tier.name}</h3>
              <div className="subscription__tier-price">
                <span className="subscription__price-amount">
                  {billingCycle === 'yearly' && tier.interval 
                    ? getYearlyPrice(tier.price)
                    : tier.price}
                </span>
                {tier.interval && (
                  <span className="subscription__price-interval">
                    {billingCycle === 'yearly' ? '/year' : tier.interval}
                  </span>
                )}
              </div>
              <p className="subscription__tier-description">{tier.description}</p>
            </div>

            <div className="subscription__card-features">
              <ul className="subscription__features-list">
                {tier.features.map((feature, index) => (
                  <li key={index} className="subscription__feature-item">
                    <i className="fas fa-check subscription__feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {tier.limitations && (
                <ul className="subscription__limitations-list">
                  {tier.limitations.map((limitation, index) => (
                    <li key={index} className="subscription__limitation-item">
                      <i className="fas fa-times subscription__limitation-icon" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="subscription__card-footer">
              {currentTier === tier.id ? (
                <Button 
                  variant="secondary" 
                  disabled
                  className="subscription__pricing-cta"
                >
                  <i className="fas fa-check" /> Current Plan
                </Button>
              ) : (
                <Button 
                  variant={tier.popular ? 'primary' : 'secondary'}
                  onClick={() => handleUpgrade(tier.id)}
                  className="subscription__pricing-cta"
                >
                  {tier.cta}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="subscription__footer">
        <div className="subscription__faq-section">
          <h2 className="subscription__faq-title">Frequently Asked Questions</h2>
          <div className="subscription__faq-grid">
            <div className="subscription__faq-item">
              <h3 className="subscription__faq-question">Can I change plans anytime?</h3>
              <p className="subscription__faq-answer">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="subscription__faq-item">
              <h3 className="subscription__faq-question">What payment methods do you accept?</h3>
              <p className="subscription__faq-answer">We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.</p>
            </div>
            <div className="subscription__faq-item">
              <h3 className="subscription__faq-question">Is there a free trial for Pro?</h3>
              <p className="subscription__faq-answer">Yes, you get a 14-day free trial of Pro features. No credit card required.</p>
            </div>
            <div className="subscription__faq-item">
              <h3 className="subscription__faq-question">What happens to my data if I downgrade?</h3>
              <p className="subscription__faq-answer">Your data is always safe. If you exceed limits after downgrading, you'll have read-only access until you're within limits.</p>
            </div>
          </div>
        </div>

        <div className="subscription__guarantee">
          <i className="fas fa-shield-alt subscription__guarantee-icon" />
          <div className="subscription__guarantee-content">
            <h3>30-Day Money-Back Guarantee</h3>
            <p>Try Pro risk-free. If you're not satisfied, get a full refund within 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
