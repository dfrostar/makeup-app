import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, CameraIcon, ClockIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useVisualSearch } from '../../hooks/useVisualSearch';

interface SearchBarProps {
    onSearch: (query: string, options?: { visualResults: any[] }) => void;
    suggestions?: string[];
    recentSearches?: string[];
    loading?: boolean;
    placeholder?: string;
    trendingSearches?: string[];
    productSuggestions?: any[];
    lookSuggestions?: any[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    suggestions = [],
    recentSearches = [],
    loading = false,
    placeholder = 'Search for looks, products, or professionals...',
    trendingSearches = [],
    productSuggestions = [],
    lookSuggestions = [],
}) => {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery) {
            onSearch(debouncedQuery);
        }
    }, [debouncedQuery, onSearch]);

    useOnClickOutside(searchRef, () => {
        setShowSuggestions(false);
        setFocused(false);
    });

    const handleFocus = () => {
        setFocused(true);
        setShowSuggestions(true);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
    };

    const handleClear = () => {
        setQuery('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    const handleProductClick = (suggestion: any) => {
        // TODO: Implement product click handler
    };

    const handleLookClick = (suggestion: any) => {
        // TODO: Implement look click handler
    };

    const clearRecentSearches = () => {
        // TODO: Implement clear recent searches handler
    };

    const removeRecentSearch = (search: string) => {
        // TODO: Implement remove recent search handler
    };

    const { isListening, transcript, isSupported: voiceSupported, toggle: toggleVoice } = useVoiceSearch({
        onSearch: (voiceQuery) => {
            setQuery(voiceQuery);
            onSearch(voiceQuery);
        },
    });

    const { 
        isSearching, 
        results: visualResults, 
        isSupported: visualSupported,
        searchByImage,
        searchByCamera
    } = useVisualSearch({
        onResults: (results) => {
            // Handle visual search results
            onSearch('', { visualResults: results });
        },
    });

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await searchByImage(file);
        }
    };

    const handleVisualSearch = () => {
        fileInputRef.current?.click();
    };

    const handleCameraSearch = async () => {
        await searchByCamera();
    };

    // Voice feedback animation
    const [voiceAmplitude, setVoiceAmplitude] = useState<number>(0);
    useEffect(() => {
        if (isListening) {
            const interval = setInterval(() => {
                setVoiceAmplitude(Math.random());
            }, 100);
            return () => clearInterval(interval);
        }
        setVoiceAmplitude(0);
    }, [isListening]);

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            {/* Search Input with Voice and Visual Search */}
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon
                        className={`h-5 w-5 transition-colors duration-200 ${
                            focused ? 'text-primary-500' : 'text-gray-400'
                        }`}
                    />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={isListening ? transcript : query}
                    onChange={handleQueryChange}
                    onFocus={handleFocus}
                    className="block w-full pl-10 pr-32 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ease-in-out hover:shadow-md"
                    placeholder={isListening ? 'Listening...' : isSearching ? 'Analyzing image...' : placeholder}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div className="absolute right-0 pr-2 flex items-center space-x-2">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                    {voiceSupported && (
                        <button
                            onClick={toggleVoice}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                isListening
                                    ? 'bg-primary-500 text-white animate-pulse'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title={isListening ? 'Stop listening' : 'Search by voice'}
                            aria-label={isListening ? 'Stop listening' : 'Search by voice'}
                        >
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                    )}
                    {visualSupported && (
                        <div className="relative">
                            <button
                                onClick={handleVisualSearch}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    isSearching
                                        ? 'bg-primary-500 text-white animate-pulse'
                                        : 'bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40'
                                }`}
                                title="Search by image"
                                aria-label="Search by image"
                            >
                                <CameraIcon className="h-5 w-5 text-primary-500" />
                            </button>
                            {isSearching && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute top-full mt-2 w-full flex justify-center">
                    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-lg">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Searching...</span>
                    </div>
                </div>
            )}

            {/* Enhanced Suggestions Dropdown */}
            {showSuggestions && (query || recentSearches.length > 0) && (
                <div className="absolute z-50 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Trending Searches */}
                    {!query && (
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Trending Now</h3>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.map((trend) => (
                                    <button
                                        key={trend}
                                        onClick={() => handleSuggestionClick(trend)}
                                        className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                                    >
                                        {trend}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categorized Results */}
                    {query && suggestions.length > 0 && (
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Products</h3>
                                    <ul className="space-y-2">
                                        {productSuggestions.map((suggestion) => (
                                            <li key={suggestion.id}>
                                                <button
                                                    onClick={() => handleProductClick(suggestion)}
                                                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                                >
                                                    <img src={suggestion.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.brand}</p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Looks</h3>
                                    <ul className="space-y-2">
                                        {lookSuggestions.map((suggestion) => (
                                            <li key={suggestion.id}>
                                                <button
                                                    onClick={() => handleLookClick(suggestion)}
                                                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                                >
                                                    <img src={suggestion.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.creator}</p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {!query && recentSearches.length > 0 && (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</h3>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    Clear all
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {recentSearches.map((search) => (
                                    <li key={search}>
                                        <button
                                            onClick={() => handleSuggestionClick(search)}
                                            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                            <ClockIcon className="h-5 w-5 text-gray-400" />
                                            <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">{search}</span>
                                            <XMarkIcon
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeRecentSearch(search);
                                                }}
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Voice Search Tutorial */}
            {isListening && (
                <div className="absolute z-50 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Voice Commands</h3>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>"Search for red lipstick"</li>
                        <li>"Find matte foundation"</li>
                        <li>"Show me summer looks"</li>
                        <li>"Look for natural makeup"</li>
                    </ul>
                </div>
            )}

            {/* Visual Search Tutorial */}
            {isSearching && (
                <div className="absolute z-50 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-pulse rounded-full h-12 w-12 bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Analyzing your image to find similar products and looks...
                    </p>
                </div>
            )}
        </div>
    );
};
