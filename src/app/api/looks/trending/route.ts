import { NextResponse } from 'next/server';
import type { Look } from '../../../../types';

// Mock trending looks with curated images
const trendingLooks: Look[] = [
  {
    id: '4',
    name: 'Glass Skin Effect',
    category: 'natural',
    // Dewy, glass skin makeup
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    artist: {
      name: 'Jenny Park',
      // Professional Korean beauty expert
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    },
    tags: ['glass skin', 'dewy', 'korean', 'glow', 'luminous'],
    likes: 2500,
    saves: 980,
    metrics: {
      engagement: 0.95,
      quality: 0.97
    }
  },
  {
    id: '5',
    name: 'Y2K Revival',
    category: 'colorful',
    // Y2K inspired makeup with glitter
    image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453',
    artist: {
      name: 'Zoe Miller',
      // Creative makeup artist portrait
      avatar: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f'
    },
    tags: ['y2k', 'retro', 'glitter', 'sparkle', 'nostalgic'],
    likes: 1800,
    saves: 750,
    metrics: {
      engagement: 0.88,
      quality: 0.90
    }
  },
  {
    id: '7',
    name: 'Editorial Avant-Garde',
    category: 'editorial',
    // High-fashion editorial makeup
    image: 'https://images.unsplash.com/photo-1526246667741-b0be3486d3aa',
    artist: {
      name: 'Luna Chen',
      // Fashion makeup artist
      avatar: 'https://images.unsplash.com/photo-1523297467724-f6758d7124c5'
    },
    tags: ['editorial', 'avant-garde', 'fashion', 'artistic', 'runway'],
    likes: 3200,
    saves: 1500,
    metrics: {
      engagement: 0.93,
      quality: 0.96
    }
  }
];

export async function GET() {
  return NextResponse.json(trendingLooks);
}
