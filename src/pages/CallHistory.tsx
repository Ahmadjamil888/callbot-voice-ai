
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, Calendar, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { PageLoader } from '@/components/LoadingSpinner';

interface CallLog {
  id: string;
  call_date: string;
  call_time: string;
  duration: number | null;
  summary: string | null;
}

const CallHistory = () => {
  const { user } = useAuth();
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  const { data: callLogs = [], isLoading } = useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('call_date', { ascending: false })
        .order('call_time', { ascending: false });
      
      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!user,
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Call History</h1>
            <p className="text-gray-600">View and manage your AI call logs and summaries</p>
          </div>

          <div className="lg:ml-0 ml-12">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2" size={20} />
                  Recent Calls
                </CardTitle>
                <CardDescription>
                  {callLogs.length > 0 
                    ? `${callLogs.length} total calls recorded`
                    : "No calls recorded yet"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {callLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Date</TableHead>
                          <TableHead className="w-[100px]">Time</TableHead>
                          <TableHead className="w-[100px]">Duration</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callLogs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                {formatDate(log.call_date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                {log.call_time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {formatDuration(log.duration)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate text-gray-600">
                                {log.summary || 'No summary available'}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCall(log)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <FileText size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Phone className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h3>
                    <p>Set up your integrations to start receiving calls!</p>
                    <Button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.location.href = '/dashboard/integrations'}
                    >
                      Setup Integrations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Call Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCall(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-gray-900">{formatDate(selectedCall.call_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-gray-900">{selectedCall.call_time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{formatDuration(selectedCall.duration)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Call Summary</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedCall.summary || 'No summary available for this call.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
