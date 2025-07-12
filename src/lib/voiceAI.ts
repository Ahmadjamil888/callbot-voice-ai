import { generateAIPrompt, processCallWithGemini } from '@/utils/geminiAI';

export interface VoiceAIConfig {
  provider: 'elevenlabs' | 'openai' | 'azure';
  apiKey: string;
  voiceId?: string;
  model?: string;
}

export interface AudioChunk {
  audio: ArrayBuffer;
  timestamp: number;
  isComplete: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export class VoiceAIService {
  private config: VoiceAIConfig;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  constructor(config: VoiceAIConfig) {
    this.config = config;
  }

  async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Audio context initialization failed');
    }
  }

  async startVoiceStream(onTranscription: (result: TranscriptionResult) => void): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const audioBuffer = await event.data.arrayBuffer();
          await this.processAudioChunk({
            audio: audioBuffer,
            timestamp: Date.now(),
            isComplete: false
          }, onTranscription);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Failed to start voice stream:', error);
      throw new Error('Voice stream initialization failed');
    }
  }

  private async processAudioChunk(
    chunk: AudioChunk, 
    onTranscription: (result: TranscriptionResult) => void
  ): Promise<void> {
    try {
      // Convert audio to base64 for API transmission
      const base64Audio = this.arrayBufferToBase64(chunk.audio);
      
      // Send to speech-to-text service
      const transcription = await this.transcribeAudio(base64Audio);
      
      if (transcription.text && transcription.text.trim()) {
        onTranscription(transcription);
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  }

  private async transcribeAudio(base64Audio: string): Promise<TranscriptionResult> {
    try {
      // Using Web Speech API as fallback for demo
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return await this.useWebSpeechAPI();
      }
      
      // In production, integrate with services like:
      // - OpenAI Whisper API
      // - Google Speech-to-Text
      // - Azure Speech Services
      
      return {
        text: '',
        confidence: 0,
        isFinal: false
      };
    } catch (error) {
      console.error('Transcription error:', error);
      return {
        text: '',
        confidence: 0,
        isFinal: false
      };
    }
  }

  private async useWebSpeechAPI(): Promise<TranscriptionResult> {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        resolve({
          text: result[0].transcript,
          confidence: result[0].confidence || 0.8,
          isFinal: result.isFinal
        });
      };

      recognition.onerror = () => {
        resolve({
          text: '',
          confidence: 0,
          isFinal: false
        });
      };

      recognition.start();
      
      // Stop after 3 seconds to prevent hanging
      setTimeout(() => {
        recognition.stop();
      }, 3000);
    });
  }

  async generateVoiceResponse(text: string): Promise<ArrayBuffer> {
    try {
      switch (this.config.provider) {
        case 'elevenlabs':
          return await this.generateElevenLabsVoice(text);
        case 'openai':
          return await this.generateOpenAIVoice(text);
        case 'azure':
          return await this.generateAzureVoice(text);
        default:
          throw new Error('Unsupported voice provider');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      // Return empty audio buffer as fallback
      return new ArrayBuffer(0);
    }
  }

  private async generateElevenLabsVoice(text: string): Promise<ArrayBuffer> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId || 'pNInz6obpgDQGcFmaJgB'}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.config.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error('ElevenLabs API error');
    }

    return await response.arrayBuffer();
  }

  private async generateOpenAIVoice(text: string): Promise<ArrayBuffer> {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy'
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI TTS API error');
    }

    return await response.arrayBuffer();
  }

  private async generateAzureVoice(text: string): Promise<ArrayBuffer> {
    // Azure Speech Services implementation
    // This would require Azure Speech SDK integration
    throw new Error('Azure voice generation not implemented yet');
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    try {
      const audioData = await this.audioContext!.decodeAudioData(audioBuffer);
      const source = this.audioContext!.createBufferSource();
      source.buffer = audioData;
      source.connect(this.audioContext!.destination);
      source.start();
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  stopVoiceStream(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.websocket) {
      this.websocket.close();
    }
  }

  cleanup(): void {
    this.stopVoiceStream();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default VoiceAIService;