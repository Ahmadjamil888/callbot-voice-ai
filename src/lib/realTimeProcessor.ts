import VoiceAIService, { TranscriptionResult, VoiceAIConfig } from './voiceAI';
import { processCallWithGemini, generateCallSummary } from '@/utils/geminiAI';
import { supabase } from '@/integrations/supabase/client';

export interface CallSession {
  id: string;
  userId: string;
  callSid: string;
  startTime: Date;
  transcript: string[];
  isActive: boolean;
  businessInfo?: {
    company_name: string;
    niche: string;
    description: string;
  };
}

export interface ProcessorConfig {
  voiceAI: VoiceAIConfig;
  responseDelay: number; // ms
  maxSilenceDuration: number; // ms
}

export class RealTimeVoiceProcessor {
  private voiceAI: VoiceAIService;
  private activeSessions: Map<string, CallSession> = new Map();
  private config: ProcessorConfig;
  private silenceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: ProcessorConfig) {
    this.config = config;
    this.voiceAI = new VoiceAIService(config.voiceAI);
  }

  async startCallSession(
    callSid: string, 
    userId: string, 
    businessInfo: CallSession['businessInfo']
  ): Promise<CallSession> {
    const session: CallSession = {
      id: callSid,
      userId,
      callSid,
      startTime: new Date(),
      transcript: [],
      isActive: true,
      businessInfo
    };

    this.activeSessions.set(callSid, session);
    
    // Initialize voice AI
    await this.voiceAI.initializeAudioContext();
    
    // Start voice processing
    await this.voiceAI.startVoiceStream((transcription) => {
      this.handleTranscription(callSid, transcription);
    });

    console.log(`Started call session: ${callSid}`);
    return session;
  }

  private async handleTranscription(callSid: string, transcription: TranscriptionResult): Promise<void> {
    const session = this.activeSessions.get(callSid);
    if (!session || !session.isActive) return;

    // Clear any existing silence timer
    const existingTimer = this.silenceTimers.get(callSid);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    if (transcription.isFinal && transcription.text.trim()) {
      // Add to transcript
      session.transcript.push(`Customer: ${transcription.text}`);
      
      // Process with AI and generate response
      await this.generateAIResponse(session, transcription.text);
    }

    // Set new silence timer
    const silenceTimer = setTimeout(() => {
      this.handleSilence(callSid);
    }, this.config.maxSilenceDuration);
    
    this.silenceTimers.set(callSid, silenceTimer);
  }

  private async generateAIResponse(session: CallSession, customerInput: string): Promise<void> {
    try {
      if (!session.businessInfo) {
        console.error('No business info available for AI response');
        return;
      }

      // Generate AI response using Gemini
      const aiResponse = await processCallWithGemini(customerInput, session.businessInfo);
      
      // Add AI response to transcript
      session.transcript.push(`AI: ${aiResponse}`);
      
      // Generate voice audio
      const audioBuffer = await this.voiceAI.generateVoiceResponse(aiResponse);
      
      // Play the response
      if (audioBuffer.byteLength > 0) {
        await this.voiceAI.playAudio(audioBuffer);
      }

      console.log(`AI Response for ${session.callSid}: ${aiResponse}`);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      const fallbackResponse = "I apologize, I'm having trouble processing your request. Could you please repeat that?";
      session.transcript.push(`AI: ${fallbackResponse}`);
      
      try {
        const fallbackAudio = await this.voiceAI.generateVoiceResponse(fallbackResponse);
        if (fallbackAudio.byteLength > 0) {
          await this.voiceAI.playAudio(fallbackAudio);
        }
      } catch (audioError) {
        console.error('Error playing fallback audio:', audioError);
      }
    }
  }

  private async handleSilence(callSid: string): Promise<void> {
    const session = this.activeSessions.get(callSid);
    if (!session || !session.isActive) return;

    // Generate a prompt to keep conversation going
    const promptResponse = "Is there anything else I can help you with today?";
    session.transcript.push(`AI: ${promptResponse}`);
    
    try {
      const audioBuffer = await this.voiceAI.generateVoiceResponse(promptResponse);
      if (audioBuffer.byteLength > 0) {
        await this.voiceAI.playAudio(audioBuffer);
      }
    } catch (error) {
      console.error('Error handling silence:', error);
    }
  }

  async endCallSession(callSid: string): Promise<void> {
    const session = this.activeSessions.get(callSid);
    if (!session) return;

    session.isActive = false;
    
    // Clear silence timer
    const timer = this.silenceTimers.get(callSid);
    if (timer) {
      clearTimeout(timer);
      this.silenceTimers.delete(callSid);
    }

    // Generate call summary
    const fullTranscript = session.transcript.join('\n');
    let summary = 'Call completed';
    
    if (session.businessInfo && fullTranscript) {
      try {
        summary = await generateCallSummary(fullTranscript, session.businessInfo);
      } catch (error) {
        console.error('Error generating call summary:', error);
      }
    }

    // Calculate call duration
    const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);

    // Update call log in database
    try {
      await supabase
        .from('call_logs')
        .update({
          duration,
          summary
        })
        .eq('user_id', session.userId)
        .eq('call_date', session.startTime.toISOString().split('T')[0])
        .eq('call_time', session.startTime.toTimeString().split(' ')[0]);
    } catch (error) {
      console.error('Error updating call log:', error);
    }

    // Cleanup
    this.voiceAI.stopVoiceStream();
    this.activeSessions.delete(callSid);
    
    console.log(`Ended call session: ${callSid}, Duration: ${duration}s`);
  }

  getActiveSession(callSid: string): CallSession | undefined {
    return this.activeSessions.get(callSid);
  }

  getAllActiveSessions(): CallSession[] {
    return Array.from(this.activeSessions.values());
  }

  async cleanup(): Promise<void> {
    // End all active sessions
    for (const [callSid] of this.activeSessions) {
      await this.endCallSession(callSid);
    }
    
    // Cleanup voice AI
    this.voiceAI.cleanup();
    
    // Clear all timers
    for (const timer of this.silenceTimers.values()) {
      clearTimeout(timer);
    }
    this.silenceTimers.clear();
  }
}

export default RealTimeVoiceProcessor;