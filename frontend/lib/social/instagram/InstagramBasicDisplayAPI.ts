import axios from 'axios';
import { InstagramProfile, InstagramMedia, InstagramInsights } from './types';

/**
 * Instagram Basic Display API wrapper
 */
export class InstagramBasicDisplayAPI {
  private baseUrl = 'https://api.instagram.com';
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  /**
   * Initialize API with credentials
   */
  public async initialize(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Connect Instagram profile using authorization code
   */
  public async connectProfile(code: string): Promise<InstagramProfile> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(`${this.baseUrl}/oauth/access_token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code,
      });

      const { access_token, user_id } = tokenResponse.data;

      // Get user profile
      const profileResponse = await axios.get(
        `${this.baseUrl}/me`,
        {
          params: {
            fields: 'id,username,account_type,media_count',
            access_token,
          },
        }
      );

      return {
        id: user_id,
        accessToken: access_token,
        ...profileResponse.data,
      };
    } catch (error) {
      console.error('Error connecting Instagram profile:', error);
      throw new Error('Failed to connect Instagram profile');
    }
  }

  /**
   * Get user's media
   */
  public async getUserMedia(userId: string, limit: number = 20): Promise<InstagramMedia[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${userId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
            limit,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw new Error('Failed to fetch Instagram media');
    }
  }

  /**
   * Get media insights
   */
  public async getMediaInsights(mediaId: string): Promise<InstagramInsights> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach,saved',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching media insights:', error);
      throw new Error('Failed to fetch media insights');
    }
  }

  /**
   * Get profile insights
   */
  public async getProfileInsights(userId: string): Promise<InstagramInsights> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${userId}/insights`,
        {
          params: {
            metric: 'audience_gender,audience_city,audience_age,audience_country',
            period: 'lifetime',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching profile insights:', error);
      throw new Error('Failed to fetch profile insights');
    }
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(token: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/refresh_access_token`,
        {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: token,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Validate access token
   */
  public async validateAccessToken(token: string): Promise<boolean> {
    try {
      await axios.get(
        `${this.baseUrl}/debug_token`,
        {
          params: { input_token: token },
        }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoke access token
   */
  public async revokeAccess(token: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/oauth/revoke_token`,
        {
          params: { token },
        }
      );
    } catch (error) {
      console.error('Error revoking access:', error);
      throw new Error('Failed to revoke access');
    }
  }
}
