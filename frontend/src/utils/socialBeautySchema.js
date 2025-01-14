class SocialBeautySchema {
  generateBeautyInfluencerSchema(influencer) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": influencer.name,
      "alternateName": influencer.username,
      "image": influencer.profileImage,
      "description": influencer.bio,
      "expertise": influencer.specialties,
      "follows": influencer.followersCount,
      "sameAs": [
        influencer.instagram,
        influencer.tiktok,
        influencer.youtube,
        influencer.pinterest
      ],
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Beauty Content Creation",
          "description": influencer.contentTypes.join(", ")
        }
      },
      "memberOf": {
        "@type": "Organization",
        "name": "Professional Beauty Network",
        "certification": influencer.certifications
      },
      "knowsAbout": [
        "Makeup Artistry",
        "Beauty Trends",
        "Skincare",
        ...influencer.expertise
      ]
    };
  }

  generateBeautyTutorialVideo(video) {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "description": video.description,
      "thumbnailUrl": video.thumbnail,
      "uploadDate": video.publishDate,
      "duration": video.duration,
      "contentUrl": video.url,
      "embedUrl": video.embedUrl,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "http://schema.org/WatchAction",
          "userInteractionCount": video.views
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "http://schema.org/LikeAction",
          "userInteractionCount": video.likes
        }
      ],
      "creator": {
        "@type": "Person",
        "name": video.creator.name,
        "url": video.creator.profile
      },
      "productUsed": video.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "url": product.purchaseLink,
        "timeUsed": product.timestamp
      })),
      "hashtags": video.hashtags,
      "musicUsed": video.backgroundMusic && {
        "@type": "MusicRecording",
        "name": video.backgroundMusic.title,
        "byArtist": video.backgroundMusic.artist
      }
    };
  }

  generateBeautyReelSchema(reel) {
    return {
      "@context": "https://schema.org",
      "@type": "SocialMediaPosting",
      "headline": reel.caption,
      "video": {
        "@type": "VideoObject",
        "name": reel.title,
        "description": reel.description,
        "thumbnailUrl": reel.coverImage,
        "duration": reel.duration,
        "contentUrl": reel.url
      },
      "author": {
        "@type": "Person",
        "name": reel.creator.name,
        "url": reel.creator.profile
      },
      "datePublished": reel.publishDate,
      "keywords": [
        ...reel.hashtags,
        ...reel.trends,
        ...reel.beautyKeywords
      ],
      "interactionStatistic": {
        "shares": reel.shareCount,
        "likes": reel.likeCount,
        "comments": reel.commentCount,
        "saves": reel.saveCount
      },
      "isBasedOn": reel.inspiredBy && {
        "@type": "CreativeWork",
        "name": reel.inspiredBy.title,
        "author": reel.inspiredBy.creator
      },
      "soundtrack": reel.audio && {
        "@type": "MusicRecording",
        "name": reel.audio.title,
        "byArtist": reel.audio.artist,
        "duration": reel.audio.duration
      }
    };
  }

  generateBeautyTransformationSchema(transformation) {
    return {
      "@context": "https://schema.org",
      "@type": "SocialMediaPosting",
      "headline": transformation.title,
      "image": {
        "@type": "ImageObject",
        "contentUrl": {
          "before": transformation.beforeImage,
          "after": transformation.afterImage,
          "process": transformation.processImages
        }
      },
      "video": transformation.transformationVideo && {
        "@type": "VideoObject",
        "name": transformation.title,
        "thumbnailUrl": transformation.thumbnail,
        "contentUrl": transformation.transformationVideo
      },
      "creator": {
        "@type": "Person",
        "name": transformation.artist,
        "url": transformation.artistProfile
      },
      "technique": transformation.techniques.map(tech => ({
        "@type": "HowTo",
        "name": tech.name,
        "step": tech.steps
      })),
      "productUsed": transformation.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "url": product.purchaseLink
      })),
      "timeRequired": transformation.duration,
      "difficulty": transformation.skillLevel,
      "socialEngagement": {
        "reactions": transformation.reactionCount,
        "shares": transformation.shareCount,
        "comments": transformation.commentCount,
        "trending": transformation.trendingScore
      }
    };
  }
}

export const socialBeautySchema = new SocialBeautySchema();
export default socialBeautySchema;
