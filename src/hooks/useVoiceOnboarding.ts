import { useState, useCallback, useRef } from 'react';
import { useScribe, CommitStrategy } from '@elevenlabs/react';
import { useToast } from '@/hooks/use-toast';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useVoiceOnboarding() {
  const [voiceMode, setVoiceMode] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    commitStrategy: CommitStrategy.VAD,
    onPartialTranscript: (data) => {
      console.log('Partial transcript:', data.text);
    },
    onCommittedTranscript: (data) => {
      console.log('Committed transcript:', data.text);
    },
  });

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Microphone Access Required',
        description: 'Please enable microphone access to use voice features.',
      });
      return false;
    }
  };

  const getScribeToken = async (): Promise<string | null> => {
    try {
      setIsFetchingToken(true);
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/elevenlabs-scribe-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to get scribe token:', error);
      toast({
        variant: 'destructive',
        title: 'Voice Error',
        description: 'Failed to initialize voice input. Please try again.',
      });
      return null;
    } finally {
      setIsFetchingToken(false);
    }
  };

  const startRecording = useCallback(async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    const token = await getScribeToken();
    if (!token) return;

    try {
      await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description: 'Failed to start voice recording. Please try again.',
      });
    }
  }, [scribe, toast]);

  const stopRecording = useCallback(() => {
    scribe.disconnect();
  }, [scribe]);

  const playTTS = useCallback(async (text: string): Promise<void> => {
    if (!voiceMode) return;
    
    try {
      setIsPlayingTTS(true);
      
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingTTS(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingTTS(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlayingTTS(false);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Failed to play voice response.',
      });
    }
  }, [voiceMode, toast]);

  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingTTS(false);
    }
  }, []);

  const toggleVoiceMode = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    } else {
      stopRecording();
      stopTTS();
    }
    setVoiceMode(enabled);
  }, [stopRecording, stopTTS]);

  return {
    voiceMode,
    toggleVoiceMode,
    isRecording: scribe.isConnected,
    startRecording,
    stopRecording,
    partialTranscript: scribe.partialTranscript,
    committedTranscripts: scribe.committedTranscripts,
    playTTS,
    stopTTS,
    isPlayingTTS,
    isFetchingToken,
  };
}
