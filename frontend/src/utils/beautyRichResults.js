class BeautyRichResults {
  generateBeautyTutorial(tutorial) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": tutorial.title,
      "description": tutorial.description,
      "totalTime": tutorial.duration,
      "image": tutorial.image,
      "supply": tutorial.products.map(product => ({
        "@type": "HowToSupply",
        "name": product.name,
        "image": product.image,
        "description": product.description
      })),
      "tool": tutorial.tools.map(tool => ({
        "@type": "HowToTool",
        "name": tool.name
      })),
      "step": tutorial.steps.map(step => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.description,
        "image": step.image,
        "url": step.url
      })),
      "video": tutorial.video ? {
        "@type": "VideoObject",
        "name": tutorial.video.title,
        "description": tutorial.video.description,
        "thumbnailUrl": tutorial.video.thumbnail,
        "uploadDate": tutorial.video.uploadDate,
        "duration": tutorial.video.duration,
        "contentUrl": tutorial.video.url
      } : undefined
    };
  }

  generateBeautyProduct(product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "color": product.shades?.map(shade => ({
        "@type": "ProductColor",
        "name": shade.name,
        "image": shade.swatch
      })),
      "material": product.ingredients,
      "awards": product.awards?.map(award => ({
        "@type": "Award",
        "name": award.title,
        "description": award.description
      })),
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "returnTime": "P30D"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Skin Type",
          "value": product.skinType
        },
        {
          "@type": "PropertyValue",
          "name": "Finish",
          "value": product.finish
        },
        {
          "@type": "PropertyValue",
          "name": "Coverage",
          "value": product.coverage
        }
      ]
    };
  }

  generateBeautyCollection(collection) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": collection.name,
      "description": collection.description,
      "hasPart": collection.products.map(product => ({
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "url": product.url
      })),
      "specialty": collection.category,
      "keywords": collection.tags.join(", ")
    };
  }

  generateBeautyArticle(article) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "image": article.image,
      "datePublished": article.publishDate,
      "dateModified": article.modifiedDate,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "url": article.author.profile
      },
      "publisher": {
        "@type": "Organization",
        "name": "MakeupHub",
        "logo": {
          "@type": "ImageObject",
          "url": "https://makeupdir.com/logo.png"
        }
      },
      "articleBody": article.content,
      "keywords": article.tags.join(", "),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.url
      }
    };
  }
}

export const beautyRichResults = new BeautyRichResults();
export default beautyRichResults;
