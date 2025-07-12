
import { Button } from "@/components/ui/button";
import { Phone, Bot, FileText, Check, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200">
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">CallBot AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#demo" className="text-gray-600 hover:text-blue-600 transition-colors">Demo</a>
            <Button onClick={() => navigate('/auth')}>
              Try Free
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Make AI Handle All Your Calls.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            24/7 voice agents that answer customer calls, book appointments, and qualify leads — powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Try Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Calls</h3>
              <p className="text-gray-600">Your customers call your business number as usual</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Responds</h3>
              <p className="text-gray-600">Our AI answers in natural voice, handling inquiries professionally</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Summary Sent</h3>
              <p className="text-gray-600">Get detailed call summaries and next steps instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: "Voice AI", desc: "Natural conversation AI that sounds human", color: "blue" },
              { icon: FileText, title: "Appointment Booking", desc: "Automatically schedule meetings and appointments", color: "green" },
              { icon: FileText, title: "Call Summary Logs", desc: "Detailed transcripts and action items", color: "purple" },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`text-${feature.color}-600`} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Listen to a Real AI Call</h2>
          <p className="text-xl text-gray-600 mb-8">Hear how our AI handles customer inquiries naturally</p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Play className="text-white" size={24} />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">AI Call Sample - 2:34</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Hello, thanks for calling TechCorp. How can I help you today?"
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((plan, idx) => (
              <div key={idx} className={`border rounded-lg p-6 hover:shadow-lg transition-shadow relative ${plan.popular ? 'border-2 border-blue-600' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {plan.price}<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center">
                      <Check className="text-green-600 mr-2" size={16} />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
