'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Globe, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CulturalPreference } from '@/contexts/ThemeContext';

type Look = {
  id: string;
  title: string;
  image: string;
  category: string;
  occasion: string;
  season: string;
  products: string[];
};

type LookComparisonProps = {
  looks: Look[];
  onClose: () => void;
  culturalPreference: CulturalPreference;
};

type ComparisonCategory = {
  name: string;
  icon: React.ReactNode;
  compare: (look1: Look, look2: Look) => {
    similar: boolean;
    details: string;
  };
};

export function LookComparison({ looks, onClose, culturalPreference }: LookComparisonProps) {
  const [selectedLooks, setSelectedLooks] = useState<[Look | null, Look | null]>([
    null,
    null,
  ]);

  const comparisonCategories: ComparisonCategory[] = [
    {
      name: 'Cultural Context',
      icon: <Globe className="h-4 w-4" />,
      compare: (look1, look2) => {
        const culturalEvents = {
          US: {
            spring: ['Easter', 'Mother\'s Day'],
            summer: ['Independence Day', 'Labor Day'],
            // Add more
          },
          JP: {
            spring: ['Hanami', 'Golden Week'],
            summer: ['Tanabata', 'Obon'],
            // Add more
          },
          IN: {
            spring: ['Holi', 'Ugadi'],
            summer: ['Raksha Bandhan', 'Independence Day'],
            // Add more
          },
        };

        const events = culturalEvents[culturalPreference.country]?.[look1.season] || [];
        const isSeasonalMatch = look1.season === look2.season;
        const relevantEvents = events.join(', ');

        return {
          similar: isSeasonalMatch,
          details: isSeasonalMatch
            ? `Both looks are suitable for ${look1.season} events like ${relevantEvents}`
            : `Different seasonal contexts: ${look1.season} vs ${look2.season}`,
        };
      },
    },
    {
      name: 'Social Context',
      icon: <Users className="h-4 w-4" />,
      compare: (look1, look2) => {
        const occasionMatch = look1.occasion === look2.occasion;
        return {
          similar: occasionMatch,
          details: occasionMatch
            ? `Both suitable for ${look1.occasion}`
            : `Different occasions: ${look1.occasion} vs ${look2.occasion}`,
        };
      },
    },
    {
      name: 'Seasonal Appropriateness',
      icon: <Calendar className="h-4 w-4" />,
      compare: (look1, look2) => {
        const seasonMatch = look1.season === look2.season;
        return {
          similar: seasonMatch,
          details: seasonMatch
            ? `Both appropriate for ${look1.season}`
            : `Different seasons: ${look1.season} vs ${look2.season}`,
        };
      },
    },
  ];

  const handleLookSelect = (look: Look, slot: 0 | 1) => {
    setSelectedLooks((prev) => {
      const newLooks = [...prev] as [Look | null, Look | null];
      newLooks[slot] = look;
      return newLooks;
    });
  };

  const canCompare = selectedLooks[0] && selectedLooks[1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Compare Looks</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Look Selection */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {[0, 1].map((slot) => (
            <div key={slot} className="space-y-4">
              <h3 className="text-sm font-medium">
                Look {slot + 1} {selectedLooks[slot]?.title}
              </h3>
              {selectedLooks[slot] ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={selectedLooks[slot]!.image}
                    alt={selectedLooks[slot]!.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                    onClick={() => handleLookSelect(null as any, slot as 0 | 1)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {looks.map((look) => (
                    <button
                      key={look.id}
                      onClick={() => handleLookSelect(look, slot as 0 | 1)}
                      className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all"
                    >
                      <img
                        src={look.image}
                        alt={look.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Results */}
        {canCompare && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Comparison Results</h3>
            <div className="space-y-4">
              {comparisonCategories.map((category) => {
                const result = category.compare(
                  selectedLooks[0]!,
                  selectedLooks[1]!
                );
                return (
                  <div
                    key={category.name}
                    className={`p-4 rounded-lg ${
                      result.similar
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon}
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{result.details}</p>
                  </div>
                );
              })}
            </div>

            {/* Product Comparison */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">Products Used</h4>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((slot) => (
                  <div key={slot} className="space-y-2">
                    <h5 className="text-sm font-medium">
                      Look {slot + 1} Products
                    </h5>
                    <ul className="space-y-1">
                      {selectedLooks[slot]?.products.map((product) => (
                        <li
                          key={product}
                          className="text-sm px-2 py-1 bg-gray-50 rounded"
                        >
                          {product}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canCompare && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
