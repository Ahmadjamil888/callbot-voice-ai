import { useState, useEffect, useCallback } from 'react';
import RealTimeVoiceProcessor, { CallSession, ProcessorConfig } from '@/lib/realTimeProcessor';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseVoiceAIOptions {
  voiceProvider: 'elevenlabs' | 'openai' | 'azure';
  apiKey: string;
  voiceId?: string;
  autoStart?: boolean;
}

interface VoiceAIState {
  isInitialized: boolean;
  isProcessing: boolean;
  currentSession: CallSession | null;
  error: string | null;
  activeSessions: CallSession[];
}

export const useVoiceAI = (options: UseVoiceAIOptions) => {
  const { user } = useAuth();
  const [processor, setProcessor] = useState<RealTimeVoiceProcessor | null>(null);
  const [state, setState] = useState<VoiceAIState>({
    isInitialized: false,
    isProcessing: false,
    currentSession: null,
    error: null,
    activeSessions: []
  });

  // Initialize processor
  useEffect(() => {
    if (!user || !options.apiKey) return;

    const config: ProcessorConfig = {
      voiceAI: {
        provider: options.voiceProvider,
        apiKey: options.apiKey,
        voiceId: options.voiceId
      },
      responseDelay: 500,
      maxSilenceDuration: 3000
    };

    const newProcessor = new RealTimeVoiceProcessor(config);
    setProcessor(newProcessor);
    
    setState(prev => ({ ...prev, isInitialized: true, error: null }));

    return () => {
      newProcessor.cleanup();
    };
  }, [user, options.apiKey, options.voiceProvider, options.voiceId]);

  // Fetch business info for AI context
  const getBusinessInfo = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company_name, niche, description')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching business info:', error);
      return null;
    }
  }, [user]);

  // Start a new call session
  const startCall = useCallback(async (callSid: string): Promise<CallSession | null> => {
    if (!processor || !user) {
      setState(prev => ({ ...prev, error: 'Voice AI not initialized' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const businessInfo = await getBusinessInfo();
      if (!businessInfo) {
        throw new Error('Business information not found');
      }

      const session = await processor.startCallSession(callSid, user.id, businessInfo);
      
      setState(prev => ({
        ...prev,
        currentSession: session,
        isProcessing: false,
        activeSessions: [...prev.activeSessions, session]
      }));

      return session;
    } catch (error) {
      console.error('Error starting call:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start call',
        isProcessing: false
      }));
      return null;
    }
  }, [processor, user, getBusinessInfo]);

  // End a call session
  const endCall = useCallback(async (callSid: string): Promise<void> => {
    if (!processor) return;

    try {
      await processor.endCallSession(callSid);
      
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession?.callSid === callSid ? null : prev.currentSession,
        activeSessions: prev.activeSessions.filter(session => session.callSid !== callSid)
      }));
    } catch (error) {
      console.error('Error ending call:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to end call'
      }));
    }
  }, [processor]);

  // Get session info
  const getSession = useCallback((callSid: string): CallSession | undefined => {
    return processor?.getActiveSession(callSid);
  }, [processor]);

  // Update active sessions periodically
  useEffect(() => {
    if (!processor) return;

    const interval = setInterval(() => {
      const activeSessions = processor.getAllActiveSessions();
      setState(prev => ({ ...prev, activeSessions }));
    }, 1000);

    return () => clearInterval(interval);
  }, [processor]);

  return {
    ...state,
    startCall,
    endCall,
    getSession,
    processor
  };
};

export default useVoiceAI;