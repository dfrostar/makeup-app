'use client';

import { useState, useEffect } from 'react';
import { ContentAgent, SearchAgent } from '../../../lib/cms/agents';

export default function CMSTestPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize agents
  const contentAgent = new ContentAgent();
  const searchAgent = new SearchAgent(contentAgent);

  useEffect(() => {
    // Load initial content
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [products, looks] = await Promise.all([
        contentAgent.getProducts(),
        contentAgent.getTrendingLooks()
      ]);
      setResults([
        ...products.map((p: any) => ({ type: 'product', ...p })),
        ...looks.map((l: any) => ({ type: 'look', ...l }))
      ]);
    } catch (err) {
      setError('Error loading content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      await loadContent();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchAgent.search(query);
      setResults(searchResults);
    } catch (err) {
      setError('Error performing search');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CMS Test Page</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search products, looks, and ingredients..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="border rounded p-4 hover:shadow-lg transition-shadow"
          >
            <div className="font-bold">{item.name || item.title}</div>
            <div className="text-sm text-gray-600">{item.type}</div>
            <div className="mt-2">{item.description}</div>
            {item.price && (
              <div className="mt-2 font-bold">${item.price}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
