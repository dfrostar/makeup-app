class BeautyTrendsSchema {
  generateSeasonalTrends(trends) {
    return {
      "@context": "https://schema.org",
      "@type": "Guide",
      "name": `${trends.season} ${trends.year} Beauty Trends`,
      "about": {
        "@type": "Thing",
        "name": "Seasonal Makeup Trends",
        "description": `Latest makeup and beauty trends for ${trends.season} ${trends.year}`
      },
      "mainEntity": trends.trends.map(trend => ({
        "@type": "Article",
        "headline": trend.name,
        "description": trend.description,
        "image": trend.image,
        "keywords": [
          trend.name,
          `${trends.season} makeup`,
          `${trends.year} beauty trends`,
          ...trend.relatedTerms
        ],
        "mentions": trend.products.map(product => ({
          "@type": "Product",
          "name": product.name,
          "brand": product.brand,
          "category": product.category
        }))
      })),
      "seasonality": {
        "@type": "Season",
        "name": trends.season,
        "startDate": trends.startDate,
        "endDate": trends.endDate
      }
    };
  }

  generateTrendingLooks(looks) {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Trending Makeup Looks",
      "itemListElement": looks.map((look, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "HowTo",
          "name": look.name,
          "image": look.image,
          "description": look.description,
          "difficulty": look.difficulty,
          "totalTime": look.estimatedTime,
          "supply": look.products.map(product => ({
            "@type": "HowToSupply",
            "name": product.name,
            "image": product.image
          })),
          "step": look.steps.map(step => ({
            "@type": "HowToStep",
            "name": step.title,
            "text": step.description,
            "image": step.image
          }))
        }
      }))
    };
  }

  generateBeautyEvent(event) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "description": event.description,
      "image": event.image,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": {
        "@type": "Place",
        "name": event.location.name,
        "address": event.location.address
      },
      "offers": {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "USD",
        "availability": event.availability
      },
      "performer": event.speakers.map(speaker => ({
        "@type": "Person",
        "name": speaker.name,
        "jobTitle": speaker.title,
        "image": speaker.image
      })),
      "superEvent": {
        "@type": "BeautyEvent",
        "name": "Beauty Industry Events",
        "description": "Professional beauty and makeup industry events"
      }
    };
  }
}

export const beautyTrendsSchema = new BeautyTrendsSchema();
export default beautyTrendsSchema;
