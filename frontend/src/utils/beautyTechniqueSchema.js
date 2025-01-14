class BeautyTechniqueSchema {
  generateMakeupTechniqueSchema(technique) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": technique.name,
      "description": technique.description,
      "image": technique.images,
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": technique.requiredProducts.reduce((total, product) => total + product.price, 0)
      },
      "skillLevel": technique.difficulty,
      "tool": technique.tools.map(tool => ({
        "@type": "HowToTool",
        "name": tool.name,
        "description": tool.description,
        "image": tool.image
      })),
      "supply": technique.requiredProducts.map(product => ({
        "@type": "HowToSupply",
        "name": product.name,
        "image": product.image,
        "description": product.description
      })),
      "step": technique.steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.description,
        "image": step.image,
        "video": step.video && {
          "@type": "VideoObject",
          "name": `${technique.name} - Step ${index + 1}`,
          "description": step.description,
          "thumbnailUrl": step.video.thumbnail,
          "contentUrl": step.video.url,
          "duration": step.video.duration
        }
      })),
      "educationalUse": "demonstration",
      "teaches": technique.skills,
      "audience": {
        "@type": "Audience",
        "audienceType": technique.skillLevel
      },
      "review": technique.reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewBody": review.comment
      }))
    };
  }

  generateApplicationMethodSchema(method) {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "name": method.name,
      "description": method.description,
      "articleBody": method.details,
      "proficiencyLevel": method.difficulty,
      "about": {
        "@type": "Thing",
        "name": method.productType,
        "description": `Application technique for ${method.productType}`
      },
      "step": method.steps.map(step => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.instructions,
        "image": step.image,
        "tipReference": step.tips
      })),
      "educationalAlignment": {
        "@type": "AlignmentObject",
        "alignmentType": "teaches",
        "educationalFramework": "Makeup Application Techniques",
        "targetName": method.techniqueCategory
      }
    };
  }

  generateBrushTechniqueSchema(brushTechnique) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `${brushTechnique.name} Brush Technique`,
      "description": brushTechnique.description,
      "tool": {
        "@type": "HowToTool",
        "name": brushTechnique.brush.name,
        "description": brushTechnique.brush.description,
        "image": brushTechnique.brush.image
      },
      "supply": brushTechnique.recommendedProducts.map(product => ({
        "@type": "HowToSupply",
        "name": product.name,
        "image": product.image
      })),
      "step": brushTechnique.motions.map(motion => ({
        "@type": "HowToStep",
        "name": motion.name,
        "text": motion.description,
        "image": motion.demonstration
      })),
      "result": {
        "@type": "Thing",
        "name": brushTechnique.effect,
        "description": brushTechnique.expectedResult
      }
    };
  }

  generateBlendingTechniqueSchema(blending) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `${blending.name} Blending Technique`,
      "description": blending.description,
      "tool": blending.tools.map(tool => ({
        "@type": "HowToTool",
        "name": tool.name,
        "description": tool.purpose
      })),
      "step": blending.steps.map(step => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.instruction,
        "image": step.demonstration,
        "pressure": step.pressureLevel,
        "motion": step.motionType
      })),
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Technique Type",
        "value": blending.techniqueType,
        "description": blending.techniqueDescription
      }
    };
  }
}

export const beautyTechniqueSchema = new BeautyTechniqueSchema();
export default beautyTechniqueSchema;
