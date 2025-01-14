class BeautyMetaEnhancer {
  enhanceProductMeta(product) {
    return {
      title: `${product.name} | ${product.brand} - MakeupHub`,
      description: this.generateProductDescription(product),
      keywords: this.generateProductKeywords(product),
      image: product.images[0],
      type: 'product',
      additionalMeta: [
        {
          property: 'product:brand',
          content: product.brand
        },
        {
          property: 'product:availability',
          content: product.inStock ? 'in stock' : 'out of stock'
        },
        {
          property: 'product:condition',
          content: 'new'
        },
        {
          property: 'product:price:amount',
          content: product.price.toString()
        },
        {
          property: 'product:price:currency',
          content: 'USD'
        }
      ]
    };
  }

  generateProductDescription(product) {
    return `${product.name} by ${product.brand} - ${product.shortDescription}. 
    ${product.benefits.join('. ')}. Available in ${product.shades.length} shades. 
    Perfect for ${product.skinType.join(', ')} skin types.`;
  }

  generateProductKeywords(product) {
    return [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      ...product.tags,
      ...product.skinType,
      ...product.concerns,
      'makeup',
      'beauty',
      'cosmetics'
    ].join(', ');
  }

  enhanceTutorialMeta(tutorial) {
    return {
      title: `${tutorial.title} - Makeup Tutorial | MakeupHub`,
      description: this.generateTutorialDescription(tutorial),
      keywords: this.generateTutorialKeywords(tutorial),
      image: tutorial.coverImage,
      type: 'article',
      additionalMeta: [
        {
          property: 'article:published_time',
          content: tutorial.publishDate
        },
        {
          property: 'article:author',
          content: tutorial.author.name
        },
        {
          property: 'article:section',
          content: 'Beauty Tutorials'
        },
        {
          property: 'video:duration',
          content: tutorial.videoDuration
        }
      ]
    };
  }

  generateTutorialDescription(tutorial) {
    return `Learn how to create ${tutorial.title} with our step-by-step tutorial. 
    ${tutorial.description}. Products used: ${tutorial.products.map(p => p.name).join(', ')}.`;
  }

  generateTutorialKeywords(tutorial) {
    return [
      'makeup tutorial',
      'beauty tutorial',
      tutorial.title,
      tutorial.category,
      ...tutorial.tags,
      ...tutorial.products.map(p => p.name),
      ...tutorial.techniques,
      'makeup tips',
      'beauty tips'
    ].join(', ');
  }

  enhanceLookMeta(look) {
    return {
      title: `${look.name} - Makeup Look | MakeupHub`,
      description: this.generateLookDescription(look),
      keywords: this.generateLookKeywords(look),
      image: look.image,
      type: 'article',
      additionalMeta: [
        {
          property: 'look:occasion',
          content: look.occasion
        },
        {
          property: 'look:difficulty',
          content: look.difficulty
        },
        {
          property: 'look:time',
          content: look.estimatedTime
        }
      ]
    };
  }

  generateLookDescription(look) {
    return `Create this stunning ${look.name} makeup look perfect for ${look.occasion}. 
    ${look.description}. Difficulty level: ${look.difficulty}. 
    Estimated time: ${look.estimatedTime} minutes.`;
  }

  generateLookKeywords(look) {
    return [
      'makeup look',
      'beauty look',
      look.name,
      look.occasion,
      look.season,
      ...look.products.map(p => p.name),
      ...look.tags,
      'makeup inspiration',
      'beauty inspiration'
    ].join(', ');
  }
}

export const beautyMetaEnhancer = new BeautyMetaEnhancer();
export default beautyMetaEnhancer;
