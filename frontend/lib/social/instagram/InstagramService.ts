import { InstagramBasicDisplayAPI } from './InstagramBasicDisplayAPI';
import { InstagramAnalytics } from './InstagramAnalytics';
import { InstagramMediaDisplay } from './InstagramMediaDisplay';
import { InstagramProfile } from './types';

/**
 * Service for managing Instagram integration features
 */
export class InstagramService {
  private static instance: InstagramService;
  private api: InstagramBasicDisplayAPI;
  private analytics: InstagramAnalytics;
  private mediaDisplay: InstagramMediaDisplay;

  private constructor() {
    this.api = new InstagramBasicDisplayAPI();
    this.analytics = new InstagramAnalytics();
    this.mediaDisplay = new InstagramMediaDisplay();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): InstagramService {
    if (!InstagramService.instance) {
      InstagramService.instance = new InstagramService();
    }
    return InstagramService.instance;
  }

  /**
   * Initialize Instagram connection
   */
  public async initialize(clientId: string, clientSecret: string, redirectUri: string) {
    await this.api.initialize(clientId, clientSecret, redirectUri);
  }

  /**
   * Connect Instagram profile
   */
  public async connectProfile(code: string): Promise<InstagramProfile> {
    const profile = await this.api.connectProfile(code);
    return profile;
  }

  /**
   * Get user's media
   */
  public async getUserMedia(userId: string, limit: number = 20) {
    const media = await this.api.getUserMedia(userId, limit);
    return this.mediaDisplay.formatMediaItems(media);
  }

  /**
   * Get media insights
   */
  public async getMediaInsights(mediaId: string) {
    const insights = await this.api.getMediaInsights(mediaId);
    return this.analytics.processMediaInsights(insights);
  }

  /**
   * Get profile insights
   */
  public async getProfileInsights(userId: string) {
    const insights = await this.api.getProfileInsights(userId);
    return this.analytics.processProfileInsights(insights);
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(token: string): Promise<string> {
    return this.api.refreshAccessToken(token);
  }

  /**
   * Check if access token is valid
   */
  public async validateAccessToken(token: string): Promise<boolean> {
    return this.api.validateAccessToken(token);
  }

  /**
   * Revoke access token
   */
  public async revokeAccess(token: string): Promise<void> {
    await this.api.revokeAccess(token);
  }
}
