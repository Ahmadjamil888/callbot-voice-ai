
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check, Star, Crown } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small businesses getting started',
    features: [
      '100 calls/month',
      'Basic AI voice',
      'Call summaries',
      'Email support',
      'Basic integrations'
    ],
    icon: Package,
    popular: false,
    color: 'bg-gray-100 text-gray-600'
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    description: 'Most popular for growing businesses',
    features: [
      '500 calls/month',
      'Advanced AI voice',
      'Appointment booking',
      'CRM integration',
      'Priority support',
      'Advanced analytics'
    ],
    icon: Star,
    popular: true,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Business',
    price: '$299',
    period: '/month',
    description: 'Enterprise solution for high-volume businesses',
    features: [
      'Unlimited calls',
      'Premium AI voice',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
      'Advanced reporting',
      'Multi-language support'
    ],
    icon: Crown,
    popular: false,
    color: 'bg-purple-100 text-purple-600'
  }
];

const Subscriptions = () => {
  const handleSubscribe = () => {
    window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-8 lg:ml-0 ml-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
            <p className="text-gray-600">Choose the perfect plan for your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:ml-0 ml-12">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative hover:shadow-lg transition-all duration-200 ${
                  plan.popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${plan.color}`}>
                    <plan.icon size={24} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleSubscribe}
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 lg:ml-0 ml-12">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Can I change plans anytime?</h4>
                  <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What happens if I exceed my call limit?</h4>
                  <p className="text-gray-600 text-sm">Additional calls are billed at $0.10 per call for Starter and Pro plans. Business plan includes unlimited calls.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Is there a free trial?</h4>
                  <p className="text-gray-600 text-sm">Yes! All new accounts start with a 7-day free trial with full access to Pro features.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
