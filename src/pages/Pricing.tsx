
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$49",
      features: ["100 calls/month", "Basic AI voice", "Call summaries"],
      popular: false
    },
    {
      name: "Pro",
      price: "$149",
      features: ["500 calls/month", "Advanced AI voice", "Appointment booking", "CRM integration"],
      popular: true
    },
    {
      name: "Business",
      price: "$299",
      features: ["Unlimited calls", "Premium AI voice", "Priority support", "Custom integrations"],
      popular: false
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
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your business needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'border-2 border-blue-600' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center">
                      <Check className="text-green-600 mr-3 h-4 w-4" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 7-day free trial</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
