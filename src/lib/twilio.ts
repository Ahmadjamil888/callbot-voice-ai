import { supabase } from '@/integrations/supabase/client';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface CallData {
  callSid: string;
  from: string;
  to: string;
  callStatus: string;
  direction: string;
}

export class TwilioWebhookHandler {
  private static instance: TwilioWebhookHandler;
  
  static getInstance(): TwilioWebhookHandler {
    if (!TwilioWebhookHandler.instance) {
      TwilioWebhookHandler.instance = new TwilioWebhookHandler();
    }
    return TwilioWebhookHandler.instance;
  }

  async handleIncomingCall(callData: CallData, userId: string): Promise<string> {
    try {
      // Log the incoming call
      await this.logCall(callData, userId);
      
      // Generate TwiML response for voice AI
      return this.generateTwiMLResponse(callData);
    } catch (error) {
      console.error('Error handling incoming call:', error);
      return this.generateErrorResponse();
    }
  }

  private async logCall(callData: CallData, userId: string): Promise<void> {
    const now = new Date();
    const callDate = now.toISOString().split('T')[0];
    const callTime = now.toTimeString().split(' ')[0];

    await supabase
      .from('call_logs')
      .insert({
        user_id: userId,
        call_date: callDate,
        call_time: callTime,
        duration: null, // Will be updated when call ends
        summary: 'Call in progress...'
      });
  }

  private generateTwiMLResponse(callData: CallData): string {
    const webhookUrl = `${window.location.origin}/api/voice/stream`;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${webhookUrl}">
      <Parameter name="callSid" value="${callData.callSid}" />
      <Parameter name="from" value="${callData.from}" />
      <Parameter name="to" value="${callData.to}" />
    </Stream>
  </Connect>
</Response>`;
  }

  private generateErrorResponse(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">I'm sorry, we're experiencing technical difficulties. Please try again later.</Say>
  <Hangup/>
</Response>`;
  }

  async updateCallDuration(callSid: string, duration: number): Promise<void> {
    try {
      await supabase
        .from('call_logs')
        .update({ duration })
        .eq('id', callSid);
    } catch (error) {
      console.error('Error updating call duration:', error);
    }
  }
}

export const twilioHandler = TwilioWebhookHandler.getInstance();