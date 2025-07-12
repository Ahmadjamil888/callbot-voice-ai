
import { Button } from "@/components/ui/button";
import { Phone, Play, Pause, Volume2, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Demo = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const demoScenarios = [
    {
      title: "Restaurant Reservation",
      description: "Customer calling to book a table for dinner",
      duration: "2:34",
      transcript: "Hello, thanks for calling Mario's Italian Kitchen. How can I help you today?"
    },
    {
      title: "Appointment Booking",
      description: "Patient scheduling a doctor's appointment",
      duration: "3:12",
      transcript: "Good morning, this is Dr. Smith's office. I'd be happy to help you schedule an appointment."
    },
    {
      title: "Product Inquiry",
      description: "Customer asking about product features and pricing",
      duration: "4:05",
      transcript: "Hi there! Thanks for your interest in our products. Let me help you find exactly what you need."
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
            Hear CallBot AI
            <span className="text-blue-600"> In Action</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Listen to real conversations between our AI agents and customers. 
            Notice how natural and professional every interaction sounds.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
            <Volume2 className="w-4 h-4 mr-2" />
            All recordings are from actual customer interactions
          </div>
        </div>

        {/* Featured Demo */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 mb-12 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Demo: Restaurant Booking</h2>
            <p className="text-gray-600">Listen to how our AI handles a typical restaurant reservation call</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                {isPlaying ? (
                  <Pause className="text-white" size={32} />
                ) : (
                  <Play className="text-white ml-1" size={32} />
                )}
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">AI Demo Call - 2:34</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/3 transition-all duration-300"></div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700 italic text-center">
                "Hello, thanks for calling Mario's Italian Kitchen. How can I help you today?"
              </p>
            </div>
          </div>
        </div>

        {/* Demo Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">More Demo Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {demoScenarios.map((scenario, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <Play className="text-gray-600 ml-1" size={16} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Duration: {scenario.duration}</p>
                  <p className="text-sm text-gray-700 italic">"{scenario.transcript}"</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Play Demo
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="bg-green-50 rounded-2xl p-12 text-center border border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try a Live Demo</h2>
          <p className="text-xl text-gray-600 mb-8">
            Want to experience CallBot AI yourself? Call our demo number and have a conversation with our AI.
          </p>
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto mb-8">
            <div className="text-2xl font-bold text-blue-600 mb-2">+1 (555) 123-DEMO</div>
            <p className="text-sm text-gray-600">Available 24/7 for testing</p>
          </div>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
