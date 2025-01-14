import { InstagramMedia, FormattedMediaItem } from './types';

/**
 * Service for formatting Instagram media for display
 */
export class InstagramMediaDisplay {
  /**
   * Format media items for display
   */
  public formatMediaItems(media: InstagramMedia[]): FormattedMediaItem[] {
    return media.map(item => this.formatMediaItem(item));
  }

  /**
   * Format a single media item
   */
  private formatMediaItem(item: InstagramMedia): FormattedMediaItem {
    return {
      id: item.id,
      type: item.media_type,
      url: this.getMediaUrl(item),
      thumbnail: this.getThumbnailUrl(item),
      caption: this.formatCaption(item.caption),
      permalink: item.permalink,
      timestamp: new Date(item.timestamp),
      username: item.username,
      dimensions: item.dimensions,
    };
  }

  /**
   * Get appropriate media URL based on type
   */
  private getMediaUrl(item: InstagramMedia): string {
    if (item.media_type === 'VIDEO') {
      return item.video_url || '';
    }
    return item.media_url || '';
  }

  /**
   * Get thumbnail URL
   */
  private getThumbnailUrl(item: InstagramMedia): string {
    if (item.media_type === 'VIDEO') {
      return item.thumbnail_url || '';
    }
    return item.media_url || '';
  }

  /**
   * Format caption text
   */
  private formatCaption(caption: string | null): string {
    if (!caption) return '';

    // Remove excessive newlines
    caption = caption.replace(/\n{3,}/g, '\n\n');

    // Extract hashtags
    const hashtags = caption.match(/#\w+/g) || [];

    // Remove hashtags from end of caption if they're separated by newlines
    caption = caption.replace(/\n+#\w+(\s+#\w+)*\s*$/g, '');

    return caption.trim();
  }

  /**
   * Extract hashtags from caption
   */
  public extractHashtags(caption: string): string[] {
    const hashtags = caption.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.slice(1)); // Remove # symbol
  }

  /**
   * Format timestamp for display
   */
  public formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
