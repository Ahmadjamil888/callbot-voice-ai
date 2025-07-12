
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CallLog {
  id: string;
  call_date: string;
  call_time: string;
  duration: number | null;
  summary: string | null;
}

export const useCallLogs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('call_date', { ascending: false })
        .order('call_time', { ascending: false });
      
      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!user,
  });
};

export const addSampleCallLogs = async (userId: string) => {
  const sampleLogs = [
    {
      user_id: userId,
      call_date: new Date().toISOString().split('T')[0],
      call_time: '14:30:00',
      duration: 180,
      summary: 'Customer inquired about pricing and availability. Provided information about current packages and scheduled a follow-up call.',
    },
    {
      user_id: userId,
      call_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      call_time: '10:15:00',
      duration: 120,
      summary: 'Technical support request. Helped customer troubleshoot their account access issue. Problem resolved successfully.',
    },
    {
      user_id: userId,
      call_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      call_time: '16:45:00',
      duration: 240,
      summary: 'New customer interested in services. Explained offerings and scheduled a demo appointment for next week.',
    },
  ];

  const { error } = await supabase
    .from('call_logs')
    .insert(sampleLogs);

  if (error) {
    console.error('Error adding sample call logs:', error);
  }
};
