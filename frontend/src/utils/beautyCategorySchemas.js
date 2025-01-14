class BeautyCategorySchemas {
  generateEyeMakeupSchema(product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "category": "Eye Makeup",
      "name": product.name,
      "description": product.description,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Finish",
          "value": product.finish
        },
        {
          "@type": "PropertyValue",
          "name": "Pigmentation",
          "value": product.pigmentation
        },
        {
          "@type": "PropertyValue",
          "name": "Waterproof",
          "value": product.isWaterproof
        },
        {
          "@type": "PropertyValue",
          "name": "Application Type",
          "value": product.applicationType
        }
      ],
      "color": product.shades.map(shade => ({
        "@type": "ProductColor",
        "name": shade.name,
        "swatchImage": shade.swatch,
        "colorCategory": shade.category
      })),
      "recommendedUse": product.looks.map(look => ({
        "@type": "HowTo",
        "name": look.name,
        "image": look.image,
        "step": look.steps
      }))
    };
  }

  generateLipProductSchema(product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "category": "Lip Products",
      "name": product.name,
      "description": product.description,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Finish",
          "value": product.finish
        },
        {
          "@type": "PropertyValue",
          "name": "Formula Type",
          "value": product.formulaType
        },
        {
          "@type": "PropertyValue",
          "name": "Wear Time",
          "value": product.wearTime
        },
        {
          "@type": "PropertyValue",
          "name": "Transfer-proof",
          "value": product.isTransferProof
        }
      ],
      "color": product.shades.map(shade => ({
        "@type": "ProductColor",
        "name": shade.name,
        "swatchImage": shade.swatch,
        "undertone": shade.undertone
      })),
      "nutrition": {
        "@type": "NutritionInformation",
        "ingredients": product.moisturizingIngredients
      }
    };
  }

  generateComplexionSchema(product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "category": "Complexion",
      "name": product.name,
      "description": product.description,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Coverage",
          "value": product.coverage
        },
        {
          "@type": "PropertyValue",
          "name": "Finish",
          "value": product.finish
        },
        {
          "@type": "PropertyValue",
          "name": "Skin Type",
          "value": product.skinType
        },
        {
          "@type": "PropertyValue",
          "name": "SPF",
          "value": product.spfRating
        }
      ],
      "color": product.shades.map(shade => ({
        "@type": "ProductColor",
        "name": shade.name,
        "swatchImage": shade.swatch,
        "undertone": shade.undertone,
        "intensity": shade.intensity
      })),
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Shade Matching",
        "value": product.shadeMatchingTips
      }
    };
  }

  generateToolSchema(tool) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "category": "Makeup Tools",
      "name": tool.name,
      "description": tool.description,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Material",
          "value": tool.material
        },
        {
          "@type": "PropertyValue",
          "name": "Best For",
          "value": tool.bestFor
        },
        {
          "@type": "PropertyValue",
          "name": "Care Instructions",
          "value": tool.careInstructions
        }
      ],
      "recommendedUse": tool.techniques.map(technique => ({
        "@type": "HowTo",
        "name": technique.name,
        "description": technique.description,
        "step": technique.steps
      })),
      "maintenance": {
        "@type": "HowTo",
        "name": "Care and Maintenance",
        "step": tool.maintenanceSteps
      }
    };
  }
}

export const beautyCategorySchemas = new BeautyCategorySchemas();
export default beautyCategorySchemas;
