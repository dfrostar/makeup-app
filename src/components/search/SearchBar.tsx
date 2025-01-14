import { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative w-full max-w-2xl">
      <div className={`
        relative flex items-center rounded-full
        ${isActive 
          ? 'bg-white shadow-lg ring-2 ring-purple-500' 
          : 'bg-gray-100 hover:bg-white hover:shadow-md'
        }
        transition-all duration-200
      `}>
        {/* Search Icon */}
        <div className="pl-4">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder="Search for looks, products, or professionals..."
          className="w-full py-3 px-4 bg-transparent focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="pr-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown (shown when active and has query) */}
      {isActive && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {/* Categories */}
          <div className="p-2 border-b">
            <div className="text-xs font-medium text-gray-500 px-3 py-1">
              CATEGORIES
            </div>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded">
              Looks matching "{query}"
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded">
              Products matching "{query}"
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded">
              Professionals matching "{query}"
            </button>
          </div>

          {/* Quick Results */}
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-1">
              QUICK RESULTS
            </div>
            {/* Example results */}
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center">
              <div className="w-10 h-10 rounded bg-gray-200 mr-3" />
              <div>
                <div className="font-medium">Natural Glam Look</div>
                <div className="text-sm text-gray-500">Makeup Look</div>
              </div>
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center">
              <div className="w-10 h-10 rounded bg-gray-200 mr-3" />
              <div>
                <div className="font-medium">Dewy Foundation</div>
                <div className="text-sm text-gray-500">Product</div>
              </div>
            </button>
          </div>

          {/* View All Results */}
          <div className="p-2 border-t bg-gray-50">
            <button className="w-full text-center px-3 py-2 text-purple-600 hover:text-purple-700 font-medium">
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
