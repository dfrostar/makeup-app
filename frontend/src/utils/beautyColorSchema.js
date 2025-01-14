class BeautyColorSchema {
  generateColorAnalysisSchema(analysis) {
    return {
      "@context": "https://schema.org",
      "@type": "AnalysisNewsArticle",
      "name": "Personal Color Analysis Results",
      "mainEntity": {
        "@type": "Report",
        "about": {
          "@type": "Person",
          "undertone": analysis.undertone,
          "seasonalPalette": analysis.season,
          "colorCharacteristics": analysis.characteristics
        },
        "result": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "PropertyValue",
                "name": "Foundation Match",
                "value": analysis.foundationMatches.map(f => f.shade).join(', '),
                "description": "Best matching foundation shades"
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "PropertyValue",
                "name": "Color Palette",
                "value": analysis.recommendedColors.join(', '),
                "description": "Recommended makeup color palette"
              }
            }
          ]
        }
      },
      "recommendedProducts": analysis.productRecommendations.map(product => ({
        "@type": "Product",
        "name": product.name,
        "brand": product.brand,
        "color": product.shade,
        "category": product.category
      }))
    };
  }

  generateShadeMatchSchema(match) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Virtual Shade Matching",
      "serviceType": "Beauty Technology",
      "provider": {
        "@type": "Organization",
        "name": "MakeupHub"
      },
      "result": {
        "@type": "PropertyValue",
        "name": "Shade Match Results",
        "value": {
          "foundationShade": match.foundationShade,
          "concealer": match.concealerShade,
          "undertone": match.undertone,
          "coverage": match.coveragePreference
        }
      },
      "potentialAction": {
        "@type": "ViewAction",
        "target": match.productRecommendations.map(product => ({
          "@type": "Product",
          "name": product.name,
          "brand": product.brand,
          "shade": product.shade,
          "url": product.url
        }))
      }
    };
  }

  generateSeasonalColorSchema(seasonal) {
    return {
      "@context": "https://schema.org",
      "@type": "Guide",
      "name": `${seasonal.season} Color Analysis`,
      "about": {
        "@type": "Thing",
        "name": "Seasonal Color Theory",
        "description": `Complete guide to ${seasonal.season} color palette and makeup recommendations`
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "PropertyValue",
              "name": "Characteristics",
              "value": seasonal.characteristics.join(', ')
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "PropertyValue",
              "name": "Best Colors",
              "value": seasonal.bestColors.join(', ')
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "PropertyValue",
              "name": "Makeup Recommendations",
              "value": seasonal.makeupRecommendations
            }
          }
        ]
      }
    };
  }
}

export const beautyColorSchema = new BeautyColorSchema();
export default beautyColorSchema;
