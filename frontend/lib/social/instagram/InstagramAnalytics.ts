import { InstagramInsights, MediaInsights, ProfileInsights } from './types';

/**
 * Service for processing Instagram analytics data
 */
export class InstagramAnalytics {
  /**
   * Process media insights data
   */
  public processMediaInsights(insights: InstagramInsights): MediaInsights {
    const metrics = insights.reduce((acc, metric) => {
      acc[metric.name] = metric.values[0].value;
      return acc;
    }, {} as Record<string, number>);

    return {
      engagement: metrics.engagement || 0,
      impressions: metrics.impressions || 0,
      reach: metrics.reach || 0,
      saved: metrics.saved || 0,
      engagementRate: this.calculateEngagementRate(metrics),
    };
  }

  /**
   * Process profile insights data
   */
  public processProfileInsights(insights: InstagramInsights): ProfileInsights {
    const metrics = insights.reduce((acc, metric) => {
      acc[metric.name] = metric.values[0].value;
      return acc;
    }, {} as Record<string, any>);

    return {
      audienceGender: this.processAudienceGender(metrics.audience_gender),
      audienceAge: this.processAudienceAge(metrics.audience_age),
      audienceCity: this.processAudienceLocation(metrics.audience_city),
      audienceCountry: this.processAudienceLocation(metrics.audience_country),
    };
  }

  /**
   * Calculate engagement rate
   */
  private calculateEngagementRate(metrics: Record<string, number>): number {
    if (!metrics.impressions) return 0;
    return (metrics.engagement / metrics.impressions) * 100;
  }

  /**
   * Process audience gender data
   */
  private processAudienceGender(data: any): Record<string, number> {
    if (!data) return {};
    
    return {
      male: data.male || 0,
      female: data.female || 0,
      other: data.other || 0,
    };
  }

  /**
   * Process audience age data
   */
  private processAudienceAge(data: any): Record<string, number> {
    if (!data) return {};

    return {
      '13-17': data['13-17'] || 0,
      '18-24': data['18-24'] || 0,
      '25-34': data['25-34'] || 0,
      '35-44': data['35-44'] || 0,
      '45-54': data['45-54'] || 0,
      '55-64': data['55-64'] || 0,
      '65+': data['65+'] || 0,
    };
  }

  /**
   * Process audience location data
   */
  private processAudienceLocation(data: any): Record<string, number> {
    if (!data) return {};

    // Sort locations by percentage and take top 10
    return Object.entries(data)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .reduce((acc, [key, value]) => {
        acc[key] = value as number;
        return acc;
      }, {} as Record<string, number>);
  }
}
