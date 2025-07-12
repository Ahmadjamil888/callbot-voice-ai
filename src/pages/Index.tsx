
import { Button } from "@/components/ui/button";
import { Phone, Bot, FileText, Check, Play, ArrowRight, Zap, Shield, Clock } from "lucide-react";
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
      <header className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">CallBot AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/features')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => navigate('/demo')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Demo
            </button>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              Try Free
            </Button>
          </div>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <section className="px-6 py-20 lg:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            24/7 AI Voice Agents Available Now
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Never Miss A Call
            <span className="block text-blue-600">Again.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered voice agents that answer customer calls, book appointments, and qualify leads 24/7. 
            <span className="text-blue-600 font-semibold"> Sounds completely human.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              onClick={() => navigate('/demo')}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>2-Minute Setup</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Preview Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer" onClick={() => navigate('/features')}>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Bot className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Voice Technology</h3>
              <p className="text-gray-600">Natural conversations that sound completely human</p>
              <div className="mt-4 text-blue-600 font-medium group-hover:underline">Learn More →</div>
            </div>
            
            <div className="text-center group cursor-pointer" onClick={() => navigate('/pricing')}>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Simple Pricing</h3>
              <p className="text-gray-600">Start free, upgrade when you're ready</p>
              <div className="mt-4 text-green-600 font-medium group-hover:underline">View Plans →</div>
            </div>
            
            <div className="text-center group cursor-pointer" onClick={() => navigate('/demo')}>
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Play className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">See It In Action</h3>
              <p className="text-gray-600">Listen to real AI customer conversations</p>
              <div className="mt-4 text-purple-600 font-medium group-hover:underline">Watch Demo →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Preview */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">Choose the plan that works for your business</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Free Trial</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <div className="text-gray-600 mb-6">7 days free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>50 calls included</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Basic AI voice</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Call summaries</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </Button>
            </div>

            <div className="border-2 border-blue-600 rounded-xl p-8 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$9</div>
              <div className="text-gray-600 mb-6">per month + first month free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Unlimited calls</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Advanced AI voice</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Appointment booking</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-600 mr-3 w-5 h-5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank')}
              >
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              View Detailed Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold">CallBot AI</span>
              </div>
              <p className="text-gray-400">
                AI-powered voice agents that never miss a call.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => navigate('/demo')} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 w-full mb-4"
              >
                Start Free Trial
              </Button>
              <p className="text-sm text-gray-400">
                No credit card required
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CallBot AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
