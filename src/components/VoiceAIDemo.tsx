import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, Settings, Volume2 } from 'lucide-react';
import { useVoiceAI } from '@/hooks/useVoiceAI';
import { LoadingSpinner } from './LoadingSpinner';

interface VoiceAIDemoProps {
  onCallStart?: (callSid: string) => void;
  onCallEnd?: (callSid: string) => void;
}

export const VoiceAIDemo = ({ onCallStart, onCallEnd }: VoiceAIDemoProps) => {
  const [apiKey, setApiKey] = useState('');
  const [voiceProvider, setVoiceProvider] = useState<'elevenlabs' | 'openai' | 'azure'>('elevenlabs');
  const [voiceId, setVoiceId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [simulatedCallSid, setSimulatedCallSid] = useState('');

  const voiceAI = useVoiceAI({
    voiceProvider,
    apiKey,
    voiceId,
    autoStart: false
  });

  useEffect(() => {
    setIsConfigured(!!apiKey && voiceAI.isInitialized);
  }, [apiKey, voiceAI.isInitialized]);

  const handleStartDemo = async () => {
    if (!isConfigured) return;

    const callSid = `demo_${Date.now()}`;
    setSimulatedCallSid(callSid);
    
    const session = await voiceAI.startCall(callSid);
    if (session && onCallStart) {
      onCallStart(callSid);
    }
  };

  const handleEndDemo = async () => {
    if (simulatedCallSid) {
      await voiceAI.endCall(simulatedCallSid);
      if (onCallEnd) {
        onCallEnd(simulatedCallSid);
      }
      setSimulatedCallSid('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2" size={20} />
            Voice AI Configuration
          </CardTitle>
          <CardDescription>
            Configure your voice AI provider to test the integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Voice Provider</Label>
              <Select value={voiceProvider} onValueChange={(value: any) => setVoiceProvider(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                  <SelectItem value="openai">OpenAI TTS</SelectItem>
                  <SelectItem value="azure">Azure Speech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          </div>

          {voiceProvider === 'elevenlabs' && (
            <div className="space-y-2">
              <Label htmlFor="voiceId">Voice ID (Optional)</Label>
              <Input
                id="voiceId"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                placeholder="e.g., pNInz6obpgDQGcFmaJgB"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Badge variant={isConfigured ? "default" : "secondary"}>
              {isConfigured ? "Configured" : "Not Configured"}
            </Badge>
            {voiceAI.isInitialized && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Voice AI Ready
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2" size={20} />
            Voice AI Demo
          </CardTitle>
          <CardDescription>
            Test your voice AI configuration with a simulated call
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {voiceAI.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {voiceAI.error}
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            {!voiceAI.currentSession ? (
              <Button
                onClick={handleStartDemo}
                disabled={!isConfigured || voiceAI.isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                {voiceAI.isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Starting...</span>
                  </>
                ) : (
                  <>
                    <Mic className="mr-2" size={20} />
                    Start Voice Demo
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleEndDemo}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
              >
                <PhoneOff className="mr-2" size={20} />
                End Demo Call
              </Button>
            )}
          </div>

          {voiceAI.currentSession && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-900">Active Demo Call</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  <Volume2 size={14} className="mr-1" />
                  Live
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Call ID:</strong> {voiceAI.currentSession.callSid}</p>
                <p><strong>Started:</strong> {voiceAI.currentSession.startTime.toLocaleTimeString()}</p>
                <p><strong>Transcript Lines:</strong> {voiceAI.currentSession.transcript.length}</p>
              </div>
              
              {voiceAI.currentSession.transcript.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded border max-h-32 overflow-y-auto">
                  <h5 className="font-medium text-gray-900 mb-2">Live Transcript:</h5>
                  {voiceAI.currentSession.transcript.slice(-3).map((line, idx) => (
                    <p key={idx} className="text-xs text-gray-600 mb-1">{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {voiceAI.activeSessions.length > 0 && (
            <div className="text-sm text-gray-600">
              <p>Active Sessions: {voiceAI.activeSessions.length}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">1. Twilio Webhook Setup</h4>
            <p>Configure your Twilio phone number webhook URL to: <code className="bg-gray-100 px-1 rounded">{window.location.origin}/api/twilio/webhook</code></p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">2. Voice AI Provider</h4>
            <p>Get API keys from ElevenLabs, OpenAI, or Azure Speech Services for voice generation.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">3. Real-time Processing</h4>
            <p>The system processes voice input in real-time and generates AI responses using your business context.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAIDemo;