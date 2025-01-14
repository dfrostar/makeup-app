class BeautyResultsSchema {
  generateBeforeAfterSchema(result) {
    return {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "contentUrl": {
        "before": result.beforeImage,
        "after": result.afterImage
      },
      "description": result.description,
      "dateCreated": result.date,
      "creator": {
        "@type": "Person",
        "name": result.artist
      },
      "about": {
        "@type": "HowTo",
        "name": result.lookName,
        "description": result.technique,
        "supply": result.productsUsed.map(product => ({
          "@type": "HowToSupply",
          "name": product.name,
          "image": product.image,
          "description": product.usage
        })),
        "step": result.steps.map(step => ({
          "@type": "HowToStep",
          "name": step.name,
          "text": step.description,
          "image": step.image
        }))
      },
      "review": result.reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating
        },
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewBody": review.comment
      }))
    };
  }

  generateVirtualTryOnResult(tryOn) {
    return {
      "@context": "https://schema.org",
      "@type": "VirtualTryOn",
      "name": tryOn.lookName,
      "image": {
        "@type": "ImageObject",
        "contentUrl": tryOn.resultImage,
        "thumbnail": tryOn.thumbnail
      },
      "usedProducts": tryOn.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "color": product.shade,
        "image": product.image,
        "placement": product.placement
      })),
      "colorAnalysis": {
        "@type": "AnalysisNewsArticle",
        "about": {
          "skinTone": tryOn.userSkinTone,
          "undertone": tryOn.userUndertone,
          "colorHarmony": tryOn.colorHarmonyScore
        }
      },
      "recommendations": tryOn.recommendations.map(rec => ({
        "@type": "Product",
        "name": rec.name,
        "description": rec.reason,
        "image": rec.image
      }))
    };
  }

  generateLookInspirationSchema(inspiration) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": inspiration.name,
      "image": inspiration.image,
      "creator": {
        "@type": "Person",
        "name": inspiration.artist,
        "sameAs": inspiration.artistProfile
      },
      "about": {
        "@type": "Thing",
        "name": inspiration.category,
        "description": inspiration.description
      },
      "teaches": inspiration.techniques,
      "material": inspiration.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "color": product.shade
      })),
      "audience": {
        "@type": "Audience",
        "audienceType": inspiration.skillLevel
      },
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": inspiration.likes
      }
    };
  }

  generateMakeoverSchema(makeover) {
    return {
      "@context": "https://schema.org",
      "@type": "BeautyService",
      "name": makeover.name,
      "description": makeover.description,
      "provider": {
        "@type": "Person",
        "name": makeover.artist,
        "jobTitle": "Makeup Artist",
        "certification": makeover.artistCertifications
      },
      "result": {
        "@type": "ImageObject",
        "contentUrl": {
          "before": makeover.beforeImage,
          "after": makeover.afterImage,
          "progress": makeover.progressShots
        }
      },
      "serviceType": "Makeup Application",
      "offers": {
        "@type": "Offer",
        "price": makeover.price,
        "priceCurrency": "USD"
      },
      "duration": makeover.duration,
      "review": makeover.clientReview && {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": makeover.clientReview.rating
        },
        "author": {
          "@type": "Person",
          "name": makeover.clientReview.name
        },
        "reviewBody": makeover.clientReview.comment
      }
    };
  }
}

export const beautyResultsSchema = new BeautyResultsSchema();
export default beautyResultsSchema;
