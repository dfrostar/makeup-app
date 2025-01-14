import { useState, useEffect, useCallback } from "react";
import { VoiceSearchService } from "../services/voiceSearch";

export const useVoiceSearch = (onSearch: (query: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [voiceService] = useState(() => new VoiceSearchService());

  useEffect(() => {
    voiceService.on("search", (text: string) => {
      onSearch(text);
      setIsListening(false);
    });

    voiceService.on("error", (err: Error) => {
      setError(err);
      setIsListening(false);
    });

    return () => {
      voiceService.stop();
    };
  }, [voiceService, onSearch]);

  const startListening = useCallback(() => {
    setError(null);
    setIsListening(true);
    voiceService.start();
  }, [voiceService]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    voiceService.stop();
  }, [voiceService]);

  return {
    isListening,
    startListening,
    stopListening,
    error,
    isSupported: voiceService.isSupported()
  };
};