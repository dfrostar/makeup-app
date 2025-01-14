import React, { useState, useRef, useEffect } from 'react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useVectorSearch } from '@/hooks/useVectorSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import { SearchResults } from './SearchResults';
import { VoiceSearchModal } from './VoiceSearchModal';
import { VisualSearchModal } from './VisualSearchModal';
import { Microphone, Camera, Search, X } from 'lucide-react';
import type { SearchResult, SearchOptions } from '@/types/search';

interface EnhancedSearchBarProps {
  onSearch: (query: string, options?: SearchOptions) => Promise<void>;
  onResultSelect: (result: SearchResult) => void;
  className?: string;
  placeholder?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  onResultSelect,
  className = '',
  placeholder = 'Search for products, looks, or professionals...'
}) => {
  // State
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const debouncedQuery = useDebounce(query, 300);
  const { startListening, stopListening, transcript, resetTranscript } = useVoiceRecognition();
  const { searchWithVector, embedQuery } = useVectorSearch();

  // Effects
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      performSearch(transcript);
    }
  }, [transcript]);

  // Handlers
  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      
      // Get vector embedding for semantic search
      const embedding = await embedQuery(searchQuery);
      
      // Perform hybrid search
      const searchResults = await searchWithVector(searchQuery, embedding);
      setResults(searchResults);
      
      // Notify parent
      await onSearch(searchQuery, { 
        embedding,
        type: 'hybrid'
      });
    } catch (error) {
      console.error('Search error:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = async () => {
    setShowVoiceModal(true);
    setIsListening(true);
    await startListening();
  };

  const stopVoiceSearch = () => {
    setIsListening(false);
    stopListening();
    setShowVoiceModal(false);
  };

  const handleVisualSearch = () => {
    setShowVisualModal(true);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    resetTranscript();
    inputRef.current?.focus();
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result);
    handleClear();
  };

  return (
    <div 
      ref={searchRef}
      className={`relative w-full ${className}`}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24"
          aria-label="Search input"
        />

        <div className="absolute right-2 flex items-center space-x-2">
          {query && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Tooltip content="Visual search">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleVisualSearch}
              aria-label="Visual search"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Voice search">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleVoiceSearch}
              aria-label="Voice search"
              data-listening={isListening}
              className={`
                transition-colors
                ${isListening ? 'text-red-500 animate-pulse' : ''}
              `}
            >
              <Microphone className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          onSelect={handleResultSelect}
          searchTerm={query}
        />
      )}

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={showVoiceModal}
        onClose={stopVoiceSearch}
        transcript={transcript}
        isListening={isListening}
      />

      {/* Visual Search Modal */}
      <VisualSearchModal
        isOpen={showVisualModal}
        onClose={() => setShowVisualModal(false)}
        onSearch={performSearch}
      />
    </div>
  );
};
