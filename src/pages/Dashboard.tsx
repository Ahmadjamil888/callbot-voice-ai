
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Phone, Bot, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  company_name: string | null;
  niche: string | null;
  description: string | null;
  trial_start: string | null;
}

interface Integration {
  id: string;
  twilio_phone_number: string | null;
  whatsapp_business_id: string | null;
}

interface CallLog {
  id: string;
  call_date: string;
  call_time: string;
  duration: number | null;
  summary: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [twilioNumber, setTwilioNumber] = useState('');
  const [whatsappId, setWhatsappId] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Fetch integrations
  const { data: integration } = useQuery({
    queryKey: ['integration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Integration | null;
    },
    enabled: !!user,
  });

  // Fetch call logs
  const { data: callLogs = [] } = useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('call_date', { ascending: false })
        .order('call_time', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!user,
  });

  // Set form values when integration data loads
  useEffect(() => {
    if (integration) {
      setTwilioNumber(integration.twilio_phone_number || '');
      setWhatsappId(integration.whatsapp_business_id || '');
    }
  }, [integration]);

  // Check if trial has expired
  const isTrialExpired = () => {
    if (!profile?.trial_start) return false;
    const trialStart = new Date(profile.trial_start);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const saveIntegrations = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const integrationData = {
        user_id: user.id,
        twilio_phone_number: twilioNumber || null,
        whatsapp_business_id: whatsappId || null,
        updated_at: new Date().toISOString(),
      };

      if (integration) {
        // Update existing
        const { error } = await supabase
          .from('integrations')
          .update(integrationData)
          .eq('id', integration.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('integrations')
          .insert(integrationData);
        
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['integration'] });
      toast({
        title: "Success",
        description: "Integrations saved successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save integrations. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <Button variant="outline" onClick={signOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.company_name || 'there'}!
          </h1>
          <p className="text-gray-600">Manage your AI voice assistant and call integrations.</p>
        </div>

        {/* Trial Warning */}
        {isTrialExpired() && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Your 7-day trial has ended. Please upgrade to continue using CallBot AI.{' '}
              <Button variant="link" className="p-0 h-auto text-orange-600">
                View Pricing
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Integration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2" size={20} />
                Connect Call Services
              </CardTitle>
              <CardDescription>
                Connect your phone services to enable AI call handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twilio">Twilio Phone Number</Label>
                <Input
                  id="twilio"
                  value={twilioNumber}
                  onChange={(e) => setTwilioNumber(e.target.value)}
                  placeholder="+1234567890"
                  disabled={isTrialExpired()}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Business ID</Label>
                <Input
                  id="whatsapp"
                  value={whatsappId}
                  onChange={(e) => setWhatsappId(e.target.value)}
                  placeholder="Enter WhatsApp Business ID"
                  disabled={isTrialExpired()}
                />
              </div>

              <Button 
                onClick={saveIntegrations} 
                disabled={saving || isTrialExpired()}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Integrations'}
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2" size={20} />
                AI Assistant Setup
              </CardTitle>
              <CardDescription>
                Your AI is configured with your business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Business Type</Label>
                <p className="text-sm text-gray-600 capitalize">
                  {profile?.niche?.replace('-', ' ') || 'Not specified'}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">AI Prompt Preview</Label>
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  You are a voice assistant for a {profile?.niche?.replace('-', ' ')} business named {profile?.company_name}.
                  Begin each call with "Welcome to {profile?.company_name}, how may I help you?"
                  Respond like a human staff member using this description: {profile?.description}
                </div>
              </div>

              <Badge variant="secondary" className="w-fit">
                ✅ AI Ready
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Call Logs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Call Logs</CardTitle>
            <CardDescription>View your recent AI-handled calls and summaries</CardDescription>
          </CardHeader>
          <CardContent>
            {callLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.call_date).toLocaleDateString()}</TableCell>
                      <TableCell>{log.call_time}</TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.summary || 'No summary available'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Phone className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No calls yet. Set up your integrations to start receiving calls!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
