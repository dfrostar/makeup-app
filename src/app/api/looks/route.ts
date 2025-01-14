import { NextResponse } from 'next/server';
import type { Look } from '../../../types';

// Mock data using carefully curated images
const mockLooks: Look[] = [
  {
    id: '1',
    name: 'Natural Glam Look',
    category: 'natural',
    // Soft glam makeup with subtle glow and natural tones
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec',
    artist: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    tags: ['natural', 'glam', 'everyday', 'bronze', 'glowing'],
    likes: 1200,
    saves: 450,
    metrics: {
      engagement: 0.85,
      quality: 0.92
    }
  },
  {
    id: '2',
    name: 'Bold Evening Makeup',
    category: 'bold',
    // Dramatic smokey eye with glam makeup
    image: 'https://images.unsplash.com/photo-1600359746315-119f1360d663',
    artist: {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    tags: ['bold', 'evening', 'dramatic', 'smokey', 'glamour'],
    likes: 980,
    saves: 320,
    metrics: {
      engagement: 0.78,
      quality: 0.88
    }
  },
  {
    id: '3',
    name: 'Colorful Festival Look',
    category: 'colorful',
    // Vibrant festival makeup with bright colors
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66',
    artist: {
      name: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
    tags: ['colorful', 'festival', 'creative', 'neon', 'artistic'],
    likes: 1500,
    saves: 600,
    metrics: {
      engagement: 0.92,
      quality: 0.95
    }
  },
  {
    id: '4',
    name: 'Dewy Fresh Face',
    category: 'natural',
    // Fresh, dewy skin with minimal makeup
    image: 'https://images.unsplash.com/photo-1614108831136-c6a1d46f9053',
    artist: {
      name: 'Lisa Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
    },
    tags: ['dewy', 'fresh', 'glowing', 'natural', 'luminous'],
    likes: 890,
    saves: 420,
    metrics: {
      engagement: 0.82,
      quality: 0.90
    }
  },
  {
    id: '5',
    name: 'Gothic Glam',
    category: 'bold',
    // Dark, edgy makeup with dramatic elements
    image: 'https://images.unsplash.com/photo-1632344004293-5776ec9f1d0e',
    artist: {
      name: 'Rachel Black',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    },
    tags: ['gothic', 'dark', 'dramatic', 'edgy', 'bold'],
    likes: 750,
    saves: 280,
    metrics: {
      engagement: 0.75,
      quality: 0.85
    }
  },
  {
    id: '6',
    name: 'Modern Classic Red Lip',
    category: 'bold',
    // Classic red lip with modern twist
    image: 'https://images.unsplash.com/photo-1588464083059-8c94f14b8987',
    artist: {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce'
    },
    tags: ['classic', 'red lip', 'timeless', 'elegant', 'sophisticated'],
    likes: 2100,
    saves: 890,
    metrics: {
      engagement: 0.89,
      quality: 0.94
    }
  },
  {
    id: '7',
    name: 'Monochromatic Pink',
    category: 'colorful',
    // All-pink monochromatic makeup look
    image: 'https://images.unsplash.com/photo-1621784562807-cb450c2f5d23',
    artist: {
      name: 'Sophie Wang',
      avatar: 'https://images.unsplash.com/photo-1535324492437-d8dea70a38a7'
    },
    tags: ['monochromatic', 'pink', 'trendy', 'coordinated', 'playful'],
    likes: 1650,
    saves: 720,
    metrics: {
      engagement: 0.88,
      quality: 0.93
    }
  },
  {
    id: '8',
    name: 'Vintage Hollywood',
    category: 'bold',
    // Classic Hollywood glamour makeup
    image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817',
    artist: {
      name: 'Victoria Adams',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    },
    tags: ['vintage', 'retro', 'glamour', 'classic', 'hollywood'],
    likes: 1850,
    saves: 840,
    metrics: {
      engagement: 0.91,
      quality: 0.96
    }
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  let filteredLooks = mockLooks;

  if (category && category !== 'all') {
    filteredLooks = filteredLooks.filter(look => look.category === category);
  }

  if (query) {
    const searchQuery = query.toLowerCase();
    filteredLooks = filteredLooks.filter(look =>
      look.name.toLowerCase().includes(searchQuery) ||
      look.artist.name.toLowerCase().includes(searchQuery) ||
      look.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  return NextResponse.json(filteredLooks);
}
