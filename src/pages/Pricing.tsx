
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Phone, Star, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "7 days free",
      description: "Perfect for testing our AI voice technology",
      features: [
        "50 calls included", 
        "Basic AI voice", 
        "Call summaries", 
        "Email support",
        "Basic analytics"
      ],
      popular: false,
      cta: "Start Free Trial",
      action: () => navigate('/auth')
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month + first month free",
      description: "Everything you need for unlimited business calls",
      features: [
        "Unlimited calls", 
        "Advanced AI voice with emotions", 
        "Appointment booking", 
        "CRM integrations",
        "Advanced analytics",
        "Priority support",
        "Custom voice training",
        "Multi-language support"
      ],
      popular: true,
      cta: "Get Pro Access",
      action: () => window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank')
    }
  ];

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "You get 7 days completely free with 50 calls included. No credit card required to start."
    },
    {
      question: "What happens after the free month on Pro?",
      answer: "After your first free month, you'll be charged $9/month. You can cancel anytime with no penalties."
    },
    {
      question: "Are there any setup fees?",
      answer: "No setup fees, no hidden costs. You only pay the monthly subscription fee."
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes, you can change your plan anytime. Changes take effect immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">CallBot AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              Try Free
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start with our free trial and upgrade when you're ready. 
            No hidden fees, no long-term contracts.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Most customers see ROI within the first week
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`relative hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-2 border-blue-600 scale-105' : 'hover:scale-105'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center">
                      <Check className="text-green-600 mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full py-6 text-lg font-semibold ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  onClick={plan.action}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Never Miss a Call Again?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses using CallBot AI to provide 24/7 customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
              onClick={() => navigate('/demo')}
            >
              Watch Demo First
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
