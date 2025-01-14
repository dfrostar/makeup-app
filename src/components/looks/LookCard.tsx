'use client';

import Image from 'next/image';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import type { Look } from '../../types';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';

type ProductTranslations = {
  en: string;
  ja: string;
  hi: string;
  ar: string;
  he: string;
};

const productTranslations: Record<string, ProductTranslations> = {
  'foundation': {
    en: 'Foundation',
    ja: 'ファンデーション',
    hi: 'फाउंडेशन',
    ar: 'كريم الأساس',
    he: 'מייק אפ',
  },
  'mascara': {
    en: 'Mascara',
    ja: 'マスカラ',
    hi: 'मस्कारा',
    ar: 'ماسكارا',
    he: 'מסקרה',
  },
  'lip-gloss': {
    en: 'Lip Gloss',
    ja: 'リップグロス',
    hi: 'लिप ग्लॉस',
    ar: 'ملمع الشفاه',
    he: 'ליפ גלוס',
  },
  'eyeshadow': {
    en: 'Eyeshadow',
    ja: 'アイシャドウ',
    hi: 'आईशैडो',
    ar: 'ظلال العيون',
    he: 'צללית',
  },
  'eyeliner': {
    en: 'Eyeliner',
    ja: 'アイライナー',
    hi: 'आईलाइनर',
    ar: 'قلم العين',
    he: 'אייליינר',
  },
  'lipstick': {
    en: 'Lipstick',
    ja: 'リップスティック',
    hi: 'लिपस्टिक',
    ar: 'أحمر الشفاه',
    he: 'ליפסטיק',
  },
  'glitter': {
    en: 'Glitter',
    ja: 'ラメ',
    hi: 'ग्लिटर',
    ar: 'جليتر',
    he: 'נצנצים',
  },
  'bright-eyeshadow': {
    en: 'Bright Eyeshadow',
    ja: 'ビビッドアイシャドウ',
    hi: 'चमकीला आईशैडो',
    ar: 'ظلال عيون لامعة',
    he: 'צללית בהירה',
  },
  'bold-lipstick': {
    en: 'Bold Lipstick',
    ja: 'ボールドリップ',
    hi: 'बोल्ड लिपस्टिक',
    ar: 'أحمر شفاه جريء',
    he: 'ליפסטיק נועז',
  },
};

interface LookCardProps {
  look: Look;
  onClick?: (look: Look) => void;
}

export function LookCard({ look, onClick }: LookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { culturalPreference } = useTheme();
  const { trackEvent } = useAnalytics();

  const handleProductClick = (product: string) => {
    trackEvent('look_product_clicked', {
      product,
      language: culturalPreference.language,
      country: culturalPreference.country,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
        culturalPreference.direction === 'rtl' ? 'rtl' : 'ltr'
      }`}
      onClick={() => onClick?.(look)}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={look.image}
          alt={look.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Stronger gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-sm">
              {look.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/20">
                <Image
                  src={look.artist.avatar}
                  alt={look.artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-white/90 font-medium drop-shadow-sm">
                {look.artist.name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{look.likes} likes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-colors">
                    <Bookmark className="w-4 h-4 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{look.saves} saves</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {look.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-black/30 backdrop-blur-sm text-white/90 hover:bg-black/40 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {look.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs bg-black/30 backdrop-blur-sm text-white/90 hover:bg-black/40 transition-colors"
            >
              +{look.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">
            {culturalPreference.language === 'en' && 'Products Used'}
            {culturalPreference.language === 'ja' && '使用製品'}
            {culturalPreference.language === 'hi' && 'प्रयुक्त उत्पाद'}
            {culturalPreference.language === 'ar' && 'المنتجات المستخدمة'}
            {culturalPreference.language === 'he' && 'מוצרים בשימוש'}
          </h4>
          <ul className="space-y-1">
            {look.products.map((product) => (
              <li
                key={product}
                className="text-sm text-gray-500 hover:text-primary cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {productTranslations[product]?.[culturalPreference.language] ||
                  productTranslations[product]?.en ||
                  product}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
