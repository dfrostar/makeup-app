import { useState } from 'react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <input 
        type="text"
        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
        placeholder="Search makeup artists, salons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
