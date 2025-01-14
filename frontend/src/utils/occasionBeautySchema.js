class OccasionBeautySchema {
  generateBeautyEventSchema(event) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": {
        "@type": event.isVirtual ? "VirtualLocation" : "Place",
        "name": event.location,
        "address": event.isVirtual ? event.virtualLink : event.address
      },
      "organizer": {
        "@type": "Organization",
        "name": event.organizer,
        "url": event.organizerWebsite
      },
      "offers": event.tickets.map(ticket => ({
        "@type": "Offer",
        "name": ticket.type,
        "price": ticket.price,
        "priceCurrency": "USD",
        "availability": ticket.available ? "InStock" : "SoldOut"
      })),
      "performers": event.artists.map(artist => ({
        "@type": "Person",
        "name": artist.name,
        "jobTitle": "Makeup Artist",
        "url": artist.profile
      })),
      "eventSchedule": event.schedule.map(session => ({
        "@type": "Event",
        "name": session.title,
        "startDate": session.startTime,
        "endDate": session.endTime,
        "performer": session.presenter
      }))
    };
  }

  generateOccasionLookSchema(look) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": look.name,
      "description": look.description,
      "image": look.images,
      "video": look.tutorial && {
        "@type": "VideoObject",
        "name": look.tutorial.title,
        "description": look.tutorial.description,
        "thumbnailUrl": look.tutorial.thumbnail,
        "contentUrl": look.tutorial.url
      },
      "supply": look.products.map(product => ({
        "@type": "HowToSupply",
        "name": product.name,
        "image": product.image,
        "description": product.usage
      })),
      "step": look.steps.map(step => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.description,
        "image": step.image,
        "url": step.videoClip
      })),
      "occasionType": {
        "@type": "Thing",
        "name": look.occasion,
        "description": look.occasionDescription
      },
      "timeRequired": look.duration,
      "skillLevel": look.difficulty,
      "seasonality": look.seasons,
      "suitableFor": look.suitableFor
    };
  }

  generateSeasonalTrendSchema(trend) {
    return {
      "@context": "https://schema.org",
      "@type": "TrendArticle",
      "headline": trend.title,
      "description": trend.description,
      "image": trend.images,
      "datePublished": trend.publishDate,
      "seasonality": {
        "@type": "Thing",
        "name": trend.season,
        "temporal": trend.timeframe
      },
      "about": {
        "@type": "Thing",
        "name": trend.category,
        "description": trend.trendDescription
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "name": trend.pageName
      },
      "featuredLooks": trend.looks.map(look => ({
        "@type": "HowTo",
        "name": look.name,
        "image": look.image,
        "supply": look.products
      })),
      "inspiration": trend.inspiration.map(source => ({
        "@type": "CreativeWork",
        "name": source.name,
        "creator": source.artist,
        "url": source.reference
      })),
      "trendingProducts": trend.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "image": product.image,
        "description": product.description
      }))
    };
  }

  generateBeautyFestivalSchema(festival) {
    return {
      "@context": "https://schema.org",
      "@type": "Festival",
      "name": festival.name,
      "description": festival.description,
      "startDate": festival.startDate,
      "endDate": festival.endDate,
      "location": {
        "@type": "Place",
        "name": festival.venue,
        "address": festival.address
      },
      "organizer": {
        "@type": "Organization",
        "name": festival.organizer,
        "url": festival.organizerWebsite
      },
      "sponsor": festival.sponsors.map(sponsor => ({
        "@type": "Organization",
        "name": sponsor.name,
        "url": sponsor.website
      })),
      "subEvent": festival.events.map(event => ({
        "@type": "Event",
        "name": event.name,
        "startDate": event.startTime,
        "endDate": event.endTime,
        "location": event.location,
        "performer": event.presenter
      })),
      "offers": festival.tickets.map(ticket => ({
        "@type": "Offer",
        "name": ticket.type,
        "price": ticket.price,
        "priceCurrency": "USD",
        "validFrom": ticket.saleStart,
        "validThrough": ticket.saleEnd
      }))
    };
  }
}

export const occasionBeautySchema = new OccasionBeautySchema();
export default occasionBeautySchema;
