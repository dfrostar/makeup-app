import React, { useState } from "react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

interface VoiceSearchProps {
  onSearch: (query: string) => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch }) => {
  const { isListening, startListening, stopListening, error, isSupported } = useVoiceSearch(onSearch);

  if (!isSupported) {
    return <div>Voice search is not supported in this browser</div>;
  }

  return (
    <button
      onClick={() => {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }}
      aria-pressed={isListening}
      aria-label="Voice search"
    >
      {isListening ? "Stop" : "Start"}
      {error && <div className="error">{error.message}</div>}
    </button>
  );
};