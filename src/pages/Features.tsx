
import { Button } from "@/components/ui/button";
import { Phone, Bot, FileText, Zap, Shield, Clock, Calendar, BarChart, Globe, Headphones, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "Natural AI Voice",
      description: "Advanced voice AI that sounds completely human with natural conversation flow and emotion recognition.",
      color: "blue"
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "Automatically schedule meetings and appointments directly through voice conversations.",
      color: "green"
    },
    {
      icon: FileText,
      title: "Call Summaries",
      description: "Detailed transcripts and action items generated automatically after each call.",
      color: "purple"
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Track call metrics, conversion rates, and customer satisfaction in real-time.",
      color: "orange"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Support for 50+ languages with native accent recognition and responses.",
      color: "pink"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and GDPR compliance to keep your data secure.",
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">CallBot AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Try Free
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-blue-600"> Modern Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to handle customer calls professionally, 24/7. 
            Our AI voice agents are equipped with advanced features to grow your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                <feature.icon className={`text-${feature.color}-600`} size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Customer Calls</h3>
              <p className="text-gray-600">Your customers call your business number as usual. No changes needed on their end.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. AI Responds</h3>
              <p className="text-gray-600">Our AI answers instantly in natural voice, handling inquiries professionally and naturally.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Summary Delivered</h3>
              <p className="text-gray-600">Get detailed call summaries and next steps instantly via email or dashboard.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of businesses using CallBot AI to never miss a call again.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-medium"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 font-medium"
              onClick={() => navigate('/demo')}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
