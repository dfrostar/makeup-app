/**
 * Instagram profile information
 */
export interface InstagramProfile {
  id: string;
  username: string;
  accountType: string;
  mediaCount: number;
  accessToken: string;
}

/**
 * Raw Instagram media item
 */
export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  video_url?: string;
  thumbnail_url?: string;
  caption: string | null;
  permalink: string;
  timestamp: string;
  username: string;
  dimensions?: {
    height: number;
    width: number;
  };
}

/**
 * Formatted media item for display
 */
export interface FormattedMediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  url: string;
  thumbnail: string;
  caption: string;
  permalink: string;
  timestamp: Date;
  username: string;
  dimensions?: {
    height: number;
    width: number;
  };
}

/**
 * Instagram insights data
 */
export interface InstagramInsights {
  name: string;
  period: string;
  values: {
    value: number;
    end_time?: string;
  }[];
}

/**
 * Processed media insights
 */
export interface MediaInsights {
  engagement: number;
  impressions: number;
  reach: number;
  saved: number;
  engagementRate: number;
}

/**
 * Processed profile insights
 */
export interface ProfileInsights {
  audienceGender: Record<string, number>;
  audienceAge: Record<string, number>;
  audienceCity: Record<string, number>;
  audienceCountry: Record<string, number>;
}

/**
 * Instagram API error
 */
export interface InstagramError {
  code: number;
  type: string;
  message: string;
}
