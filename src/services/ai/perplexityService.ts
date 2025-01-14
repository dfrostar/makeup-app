import axios from 'axios';
import type { Look, ContentQualityReport } from '../../types';

export class PerplexityService {
  private static instance: PerplexityService;
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  private constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Perplexity API key not found in environment variables');
    }
  }

  public static getInstance(): PerplexityService {
    if (!PerplexityService.instance) {
      PerplexityService.instance = new PerplexityService();
    }
    return PerplexityService.instance;
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Perplexity API request failed:', error);
      throw error;
    }
  }

  async discoverContent(query: string): Promise<Look[]> {
    const prompt = `Find makeup looks and tutorials related to "${query}". For each look, provide:
    - A descriptive name
    - The category (natural, bold, colorful, bridal, editorial, or sfx)
    - The source URL
    - The artist's name and profile URL
    - A list of key products used
    - Relevant tags
    Format as JSON array.`;

    const response = await this.makeRequest('/chat/completions', {
      model: 'pplx-7b-online',
      messages: [
        { role: 'system', content: 'You are a beauty and makeup expert.' },
        { role: 'user', content: prompt }
      ]
    });

    const looks = JSON.parse(response.choices[0].message.content);
    return looks.map((look: any) => ({
      id: `pplx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: look.name,
      category: look.category.toLowerCase(),
      image: look.sourceUrl,
      artist: {
        name: look.artistName,
        avatar: look.artistProfileUrl
      },
      products: look.products.map((product: string) => ({
        id: `prod-${Math.random().toString(36).substr(2, 9)}`,
        name: product,
        brand: 'Unknown'
      })),
      tags: look.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  async analyzeContent(look: Look): Promise<ContentQualityReport> {
    const prompt = `Analyze this makeup look and provide a detailed quality report:
    Name: ${look.name}
    Category: ${look.category}
    Artist: ${look.artist.name}
    Tags: ${look.tags.join(', ')}
    
    Provide:
    1. Overall quality score (0-1)
    2. Technical quality assessment (lighting and composition scores)
    3. Content quality assessment (relevance and accuracy scores)
    4. List of recommendations for improvement
    Format as JSON.`;

    const response = await this.makeRequest('/chat/completions', {
      model: 'pplx-7b-online',
      messages: [
        { role: 'system', content: 'You are a beauty and makeup expert.' },
        { role: 'user', content: prompt }
      ]
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return {
      qualityScore: analysis.overallScore,
      technicalQuality: {
        lighting: analysis.technical.lighting,
        composition: analysis.technical.composition
      },
      contentQuality: {
        relevance: analysis.content.relevance,
        accuracy: analysis.content.accuracy
      },
      recommendations: analysis.recommendations
    };
  }

  async getTrendingTopics(): Promise<string[]> {
    const prompt = 'What are the current trending topics and techniques in makeup? List the top 10 trends with brief descriptions.';

    const response = await this.makeRequest('/chat/completions', {
      model: 'pplx-7b-online',
      messages: [
        { role: 'system', content: 'You are a beauty and makeup expert.' },
        { role: 'user', content: prompt }
      ]
    });

    const trends = JSON.parse(response.choices[0].message.content);
    return trends.map((trend: any) => trend.name);
  }
}
