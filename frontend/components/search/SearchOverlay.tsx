import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface SearchResult {
  id: string;
  type: 'product' | 'look' | 'article' | 'ingredient';
  title: string;
  description: string;
  image?: string;
  url: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-4 z-50 mx-auto max-w-2xl"
          >
            <Card className="overflow-hidden">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products, looks, ingredients..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 pr-11"
                  fullWidth
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Results */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-auto max-h-[calc(100vh-200px)]"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto" />
                    <p className="mt-2">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y">
                    {results.map((result) => (
                      <a
                        key={result.id}
                        href={result.url}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {result.image && (
                            <img
                              src={result.image}
                              alt={result.title}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                ) : null}

                {/* Quick Links */}
                <div className="p-4 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Quick Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Trending Products
                    </Button>
                    <Button variant="outline" size="sm">
                      New Arrivals
                    </Button>
                    <Button variant="outline" size="sm">
                      Popular Looks
                    </Button>
                    <Button variant="outline" size="sm">
                      Ingredient Guide
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
