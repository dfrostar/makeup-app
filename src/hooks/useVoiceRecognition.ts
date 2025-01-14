import { useState, useCallback, useEffect } from 'react';

interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError(new Error('Speech recognition is not supported in this browser'));
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.lang = options.language || 'en-US';
      recognitionInstance.continuous = options.continuous ?? false;
      recognitionInstance.interimResults = options.interimResults ?? true;

      // Set up event handlers
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(new Error(event.error));
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [options.language, options.continuous, options.interimResults]);

  const startListening = useCallback(async () => {
    if (!recognition) {
      setError(new Error('Speech recognition is not initialized'));
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognition.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start voice recognition'));
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [recognition, isListening]);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    supported: !!recognition
  };
};
