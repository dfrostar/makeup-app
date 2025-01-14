'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Sparkles, Moon, Palette, CircleEllipsis, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { LookCard } from '@/components/looks/LookCard';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Look } from '@/types';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'natural', name: 'Natural & Glowing', icon: Sparkles },
  { id: 'bold', name: 'Bold & Dramatic', icon: Moon },
  { id: 'colorful', name: 'Colorful & Playful', icon: Palette },
  { id: 'bridal', name: 'Bridal', icon: CircleEllipsis },
  { id: 'editorial', name: 'Editorial', icon: Camera },
];

async function fetchLooks(category?: string, query?: string): Promise<Look[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query) params.append('query', query);

    const response = await fetch(`/api/looks?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch looks');
    return response.json();
  } catch (error) {
    console.error('Error fetching looks:', error);
    return [];
  }
}

async function fetchTrendingLooks(): Promise<Look[]> {
  try {
    const response = await fetch('/api/looks/trending');
    if (!response.ok) throw new Error('Failed to fetch trending looks');
    return response.json();
  } catch (error) {
    console.error('Error fetching trending looks:', error);
    return [];
  }
}

export function DiscoveryView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: looks = [] } = useQuery({
    queryKey: ['looks', selectedCategory, searchQuery],
    queryFn: () => fetchLooks(selectedCategory, searchQuery),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: trendingLooks = [] } = useQuery({
    queryKey: ['trending-looks'],
    queryFn: fetchTrendingLooks,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const displayedLooks = selectedCategory === 'trending' ? trendingLooks : looks;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <div className="space-y-6 mb-8">
            {/* Category Filter */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search looks..."
                className="w-full h-12 pl-5 pr-12 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Looks Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedLooks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
