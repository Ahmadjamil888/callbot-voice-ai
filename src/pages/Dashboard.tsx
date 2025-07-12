
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Phone, Bot, AlertTriangle, TrendingUp, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { StatsCard } from '@/components/StatsCard';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';

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

interface CallStats {
  totalCalls: number;
  thisMonth: number;
  avgDuration: number;
  connectedServices: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
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

  // Fetch call stats
  const { data: callStats, isLoading: statsLoading } = useQuery({
    queryKey: ['callStats'],
    queryFn: async (): Promise<CallStats> => {
      const { data: calls, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;

      const now = new Date();
      const thisMonth = calls?.filter(call => {
        const callDate = new Date(call.call_date);
        return callDate.getMonth() === now.getMonth() && 
               callDate.getFullYear() === now.getFullYear();
      }).length || 0;

      const avgDuration = calls?.length 
        ? Math.round(calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length)
        : 0;

      const connectedServices = [
        integration?.twilio_phone_number,
        integration?.whatsapp_business_id
      ].filter(Boolean).length;

      return {
        totalCalls: calls?.length || 0,
        thisMonth,
        avgDuration,
        connectedServices
      };
    },
    enabled: !!user,
  });

  // Check if trial has expired and user is not subscribed
  const isTrialExpired = () => {
    if (isSubscribed) return false;
    if (!profile?.trial_start) return false;
    const trialStart = new Date(profile.trial_start);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank');
    // Set subscribed status after payment (in real app, this would be handled by webhook)
    setTimeout(() => {
      setIsSubscribed(true);
      toast({
        title: "Success",
        description: "Thank you for subscribing! You now have unlimited access.",
      });
    }, 1000);
  };

  if (profileLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-0 ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 lg:ml-0 ml-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back{profile?.company_name ? `, ${profile.company_name}` : ''}
            </h1>
            <p className="text-gray-600">Manage your AI voice assistant and call integrations.</p>
          </div>

          {/* Trial Warning */}
          {isTrialExpired() && (
            <Alert className="mb-6 border-orange-200 bg-orange-50 lg:ml-0 ml-12">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 flex items-center justify-between">
                <span>Your 7-day trial has ended. Please upgrade to continue using CallBot AI.</span>
                <Button 
                  onClick={handleUpgrade}
                  className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 lg:ml-0 ml-12">
            <StatsCard
              title="Total Calls"
              value={callStats?.totalCalls || 0}
              icon={Phone}
              loading={statsLoading}
            />
            <StatsCard
              title="This Month"
              value={callStats?.thisMonth || 0}
              icon={TrendingUp}
              loading={statsLoading}
            />
            <StatsCard
              title="Avg Duration"
              value={`${Math.floor((callStats?.avgDuration || 0) / 60)}:${String((callStats?.avgDuration || 0) % 60).padStart(2, '0')}`}
              icon={Clock}
              loading={statsLoading}
            />
            <StatsCard
              title="Connected Services"
              value={callStats?.connectedServices || 0}
              icon={Users}
              loading={statsLoading}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:ml-0 ml-12">
            {/* AI Assistant Status */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2" size={20} />
                  AI Assistant Status
                </CardTitle>
                <CardDescription>
                  Your AI is configured and ready to handle calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-900">✅ AI Ready</p>
                    <p className="text-sm text-green-700">
                      Configured for {profile?.niche?.replace('-', ' ') || 'general'} business
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                
                {profile?.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium mb-2">AI Instructions:</p>
                    <p className="text-sm text-gray-700">{profile.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your CallBot AI settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/dashboard/integrations'}
                >
                  <Phone className="mr-2" size={16} />
                  Manage Integrations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-200 hover:bg-gray-50"
                  onClick={() => window.location.href = '/dashboard/history'}
                >
                  <AlertTriangle className="mr-2" size={16} />
                  View Call History
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-200 hover:bg-gray-50"
                  onClick={() => window.location.href = '/dashboard/voice-ai-test'}
                >
                  <Phone className="mr-2" size={16} />
                  Test Voice AI
                </Button>
                {!isSubscribed && (
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    <TrendingUp className="mr-2" size={16} />
                    Upgrade to Pro
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
