import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { VoiceAIDemo } from '@/components/VoiceAIDemo';
import { useToast } from '@/hooks/use-toast';

const VoiceAITest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [callHistory, setCallHistory] = useState<string[]>([]);

  const handleCallStart = (callSid: string) => {
    toast({
      title: "Demo Call Started",
      description: `Voice AI demo session ${callSid} is now active.`,
    });
  };

  const handleCallEnd = (callSid: string) => {
    setCallHistory(prev => [...prev, callSid]);
    toast({
      title: "Demo Call Ended",
      description: `Voice AI demo session completed successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-8 lg:ml-0 ml-12">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice AI Testing</h1>
            <p className="text-gray-600">Test and configure your voice AI integration</p>
          </div>

          <div className="lg:ml-0 ml-12">
            <VoiceAIDemo 
              onCallStart={handleCallStart}
              onCallEnd={handleCallEnd}
            />

            {callHistory.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Demo Call History</CardTitle>
                  <CardDescription>
                    Recent voice AI demo sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {callHistory.slice(-5).reverse().map((callSid, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{callSid}</span>
                        </div>
                        <span className="text-xs text-gray-500">Demo completed</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAITest;