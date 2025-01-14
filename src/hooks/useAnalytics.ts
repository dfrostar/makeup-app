type EventData = Record<string, any>;

class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;

  private constructor() {
    this.initializeAnalytics();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private async initializeAnalytics() {
    if (this.initialized) return;

    try {
      // Initialize analytics services here
      // Example: Google Analytics, Mixpanel, etc.
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  public async trackEvent(
    eventName: string,
    eventData: EventData = {},
    options: { immediate?: boolean } = {}
  ): Promise<void> {
    if (!this.initialized) {
      await this.initializeAnalytics();
    }

    // Add common properties
    const enrichedData = {
      ...eventData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Track the event
    try {
      // Send to analytics services
      console.log(`[Analytics] ${eventName}:`, enrichedData);

      // Example: Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, enrichedData);
      }

      // Example: Send to Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track(eventName, enrichedData);
      }

      // Store in local analytics queue for batch processing
      if (!options.immediate) {
        this.queueEvent(eventName, enrichedData);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private queueEvent(eventName: string, eventData: EventData): void {
    const queue = this.getEventQueue();
    queue.push({ eventName, eventData, timestamp: new Date().toISOString() });
    localStorage.setItem('analyticsQueue', JSON.stringify(queue));

    // Process queue if it reaches a certain size
    if (queue.length >= 10) {
      this.processEventQueue();
    }
  }

  private getEventQueue(): Array<{
    eventName: string;
    eventData: EventData;
    timestamp: string;
  }> {
    try {
      const queue = localStorage.getItem('analyticsQueue');
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  private async processEventQueue(): Promise<void> {
    const queue = this.getEventQueue();
    if (queue.length === 0) return;

    try {
      // Process events in batch
      // Example: Send to backend analytics service
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queue),
      });

      if (response.ok) {
        // Clear processed events
        localStorage.setItem('analyticsQueue', '[]');
      }
    } catch (error) {
      console.error('Failed to process analytics queue:', error);
    }
  }
}

export function useAnalytics() {
  const analyticsService = AnalyticsService.getInstance();

  return {
    trackEvent: (
      eventName: string,
      eventData?: EventData,
      options?: { immediate?: boolean }
    ) => analyticsService.trackEvent(eventName, eventData, options),
  };
}
