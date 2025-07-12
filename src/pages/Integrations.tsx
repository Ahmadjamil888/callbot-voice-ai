
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';

interface Integration {
  id: string;
  twilio_phone_number: string | null;
  whatsapp_business_id: string | null;
}

const Integrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [twilioNumber, setTwilioNumber] = useState('');
  const [whatsappId, setWhatsappId] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: integration, isLoading } = useQuery({
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

  useEffect(() => {
    if (integration) {
      setTwilioNumber(integration.twilio_phone_number || '');
      setWhatsappId(integration.whatsapp_business_id || '');
    }
  }, [integration]);

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
        const { error } = await supabase
          .from('integrations')
          .update(integrationData)
          .eq('id', integration.id);
        
        if (error) throw error;
      } else {
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

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-8 lg:ml-0 ml-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
            <p className="text-gray-600">Connect your phone services to enable AI call handling</p>
          </div>

          <div className="space-y-6 lg:ml-0 ml-12">
            {/* Twilio Integration */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="mr-2" size={20} />
                    Twilio Phone Integration
                  </div>
                  {twilioNumber ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      <XCircle size={14} className="mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Connect your Twilio phone number to receive calls through AI
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
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">
                    Enter your Twilio phone number in international format
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2" size={20} />
                    WhatsApp Business Integration
                  </div>
                  {whatsappId ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      <XCircle size={14} className="mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Connect your WhatsApp Business account for message handling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Business ID</Label>
                  <Input
                    id="whatsapp"
                    value={whatsappId}
                    onChange={(e) => setWhatsappId(e.target.value)}
                    placeholder="Enter WhatsApp Business ID"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">
                    Find your Business ID in your WhatsApp Business settings
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveIntegrations} 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  'Save Integrations'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
