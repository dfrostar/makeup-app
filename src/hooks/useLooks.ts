import { useState, useEffect } from 'react';

interface Look {
  id: string;
  name: string;
  category: string;
  image: string;
  artist: {
    name: string;
    avatar: string;
  };
  likes: number;
  saves: number;
}

export const useLooks = (category: string) => {
  const [looks, setLooks] = useState<Look[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Example data - replace with actual API call
        const exampleLooks: Look[] = [
          {
            id: '1',
            name: 'Natural Glow',
            category: 'natural',
            image: '/images/looks/natural-glow.jpg',
            artist: {
              name: 'Sarah Johnson',
              avatar: '/images/artists/sarah.jpg'
            },
            likes: 1240,
            saves: 890
          },
          {
            id: '2',
            name: 'Dramatic Evening',
            category: 'editorial',
            image: '/images/looks/dramatic-evening.jpg',
            artist: {
              name: 'Michael Chen',
              avatar: '/images/artists/michael.jpg'
            },
            likes: 2100,
            saves: 1500
          },
          // Add more example looks here
        ];

        // Filter looks by category if not 'all'
        const filteredLooks = category === 'all' 
          ? exampleLooks 
          : exampleLooks.filter(look => look.category === category);

        setLooks(filteredLooks);
        setError(null);
      } catch (err) {
        console.error('Error fetching looks:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch looks'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLooks();
  }, [category]);

  return {
    looks,
    isLoading,
    error
  };
};
