'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { LookCard } from '@/components/looks/LookCard';
import { LookScheduler } from '@/components/looks/LookScheduler';
import { ColorPalette } from '@/components/looks/ColorPalette';
import { useAnalytics } from '@/hooks/useAnalytics';

type Look = {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image: string;
  season: string;
  culturalContext: string[];
  products: string[];
};

const defaultLooks: Look[] = [
  {
    id: '1',
    title: {
      en: 'Natural Everyday Look',
      ja: 'ナチュラルな毎日メイク',
      hi: 'प्राकृतिक दैनिक लुक',
      ar: 'إطلالة يومية طبيعية',
      he: 'מראה יומיומי טבעי',
    },
    description: {
      en: 'A fresh and natural look perfect for daily wear',
      ja: '毎日のメイクに最適なフレッシュで自然な仕上がり',
      hi: 'दैनिक पहनने के लिए एकदम सही ताज़ा और प्राकृतिक लुक',
      ar: 'إطلالة منعشة وطبيعية مثالية للارتداء اليومي',
      he: 'מראה רענן וטבעי מושלם לשימוש יומיומי',
    },
    image: '/images/looks/natural.jpg',
    season: 'all',
    culturalContext: ['casual', 'work'],
    products: ['foundation', 'mascara', 'lip-gloss'],
  },
  {
    id: '2',
    title: {
      en: 'Evening Glamour',
      ja: 'イブニンググラマー',
      hi: 'शाम की शानदार मेकअप',
      ar: 'إطلالة السهرة الساحرة',
      he: 'זוהר ערב',
    },
    description: {
      en: 'Sophisticated evening look with dramatic eyes',
      ja: 'ドラマチックな目元で洗練された夜のメイク',
      hi: 'नाटकीय आंखों के साथ परिष्कृत शाम का लुक',
      ar: 'إطلالة مسائية راقية مع عيون درامية',
      he: 'מראה ערב מתוחכם עם עיניים דרמטיות',
    },
    image: '/images/looks/evening.jpg',
    season: 'all',
    culturalContext: ['party', 'formal'],
    products: ['eyeshadow', 'eyeliner', 'lipstick'],
  },
  {
    id: '3',
    title: {
      en: 'Festival Ready',
      ja: 'フェスティバルメイク',
      hi: 'त्योहार के लिए तैयार',
      ar: 'إطلالة المهرجان',
      he: 'מוכן לפסטיבל',
    },
    description: {
      en: 'Vibrant and festive look for special celebrations',
      ja: 'お祭りやイベントに最適な鮮やかで華やかなメイク',
      hi: 'विशेष समारोहों के लिए जीवंत और त्योहारी लुक',
      ar: 'إطلالة نابضة بالحياة واحتفالية للمناسبات الخاصة',
      he: 'מראה תוסס וחגיגי לחגיגות מיוחדות',
    },
    image: '/images/looks/festival.jpg',
    season: 'spring',
    culturalContext: ['festival', 'celebration'],
    products: ['glitter', 'bright-eyeshadow', 'bold-lipstick'],
  },
];

export default function LooksPage() {
  const { culturalPreference } = useTheme();
  const { trackEvent } = useAnalytics();
  const [looks, setLooks] = useState<Look[]>(defaultLooks);
  const [filteredLooks, setFilteredLooks] = useState<Look[]>(defaultLooks);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  useEffect(() => {
    // Track page view
    trackEvent('looks_page_viewed', {
      language: culturalPreference.language,
      country: culturalPreference.country,
    });

    // In a real app, fetch looks from API
    // const fetchLooks = async () => {
    //   const response = await fetch('/api/looks');
    //   const data = await response.json();
    //   setLooks(data);
    // };
    // fetchLooks();
  }, []);

  useEffect(() => {
    // Filter looks based on season and cultural context
    const filtered = looks.filter(look => {
      const seasonMatch = selectedSeason === 'all' || look.season === selectedSeason;
      const culturalMatch = look.culturalContext.some(context =>
        culturalPreference.events[selectedSeason as keyof typeof culturalPreference.events]?.includes(context)
      );
      return seasonMatch || culturalMatch;
    });
    setFilteredLooks(filtered);
  }, [selectedSeason, looks, culturalPreference]);

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    trackEvent('looks_season_filter_changed', {
      season,
      language: culturalPreference.language,
    });
  };

  return (
    <div className={`min-h-screen p-6 ${culturalPreference.direction === 'rtl' ? 'rtl' : 'ltr'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {culturalPreference.language === 'en' && 'Beauty Looks'}
            {culturalPreference.language === 'ja' && 'メイクルック'}
            {culturalPreference.language === 'hi' && 'ब्यूटी लुक्स'}
            {culturalPreference.language === 'ar' && 'إطلالات الجمال'}
            {culturalPreference.language === 'he' && 'מראות יופי'}
          </h1>
          <ColorPalette />
        </header>

        <div className="mb-6">
          <select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">
              {culturalPreference.language === 'en' && 'All Seasons'}
              {culturalPreference.language === 'ja' && '全シーズン'}
              {culturalPreference.language === 'hi' && 'सभी मौसम'}
              {culturalPreference.language === 'ar' && 'كل المواسم'}
              {culturalPreference.language === 'he' && 'כל העונות'}
            </option>
            <option value="spring">
              {culturalPreference.language === 'en' && 'Spring'}
              {culturalPreference.language === 'ja' && '春'}
              {culturalPreference.language === 'hi' && 'वसंत'}
              {culturalPreference.language === 'ar' && 'الربيع'}
              {culturalPreference.language === 'he' && 'אביב'}
            </option>
            <option value="summer">
              {culturalPreference.language === 'en' && 'Summer'}
              {culturalPreference.language === 'ja' && '夏'}
              {culturalPreference.language === 'hi' && 'गर्मी'}
              {culturalPreference.language === 'ar' && 'الصيف'}
              {culturalPreference.language === 'he' && 'קיץ'}
            </option>
            <option value="fall">
              {culturalPreference.language === 'en' && 'Fall'}
              {culturalPreference.language === 'ja' && '秋'}
              {culturalPreference.language === 'hi' && 'पतझड़'}
              {culturalPreference.language === 'ar' && 'الخريف'}
              {culturalPreference.language === 'he' && 'סתיו'}
            </option>
            <option value="winter">
              {culturalPreference.language === 'en' && 'Winter'}
              {culturalPreference.language === 'ja' && '冬'}
              {culturalPreference.language === 'hi' && 'सर्दी'}
              {culturalPreference.language === 'ar' && 'الشتاء'}
              {culturalPreference.language === 'he' && 'חורף'}
            </option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map((look) => (
            <LookCard
              key={look.id}
              title={look.title[culturalPreference.language] || look.title.en}
              description={look.description[culturalPreference.language] || look.description.en}
              image={look.image}
              products={look.products}
            />
          ))}
        </div>

        <div className="mt-8">
          <LookScheduler looks={filteredLooks} />
        </div>
      </motion.div>
    </div>
  );
}
